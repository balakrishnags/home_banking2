import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { RouteStrings } from "../../utils/common";
import { configUrl, envType } from "../../apis/api.config";
import { PostRequestHook, getRequest } from "../../apis/Services";
import './Dashboard.scss'
import { setEnvData, setProfileDetail, setSnackbar } from "../../store/reducers/ui.reducer";

const Dashboard = () => {
  const dispatch = useDispatch()
  const { auth: { isAuth }, userInfo } = useSelector((state) => state.UIStore);
  const { getRequest } = PostRequestHook()

  useEffect(() => {
    if (isAuth) {
      getEnvData()
      getProfileDetails()
    }
  }, [isAuth])

  useEffect(() => {
    if (userInfo?.userId) {
      const eventSource = new EventSource(`http://localhost:8081/sse/updateUserDetailsEvent`);

      eventSource.onmessage = (event) => {
        let data = JSON.parse(event.data)
        if (Number(data.userId) === userInfo.userId) {
          // console.log("🚀 ~ file: Dashboard.js:30 ~ useEffect ~ data:====", userInfo.userId, typeof (userInfo.userId))
          getProfileDetails()
        }
      };

      eventSource.onerror = (error) => {
        console.error('Error with SSE connection:', error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, []);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8081/sse/updatePasswordEvent`);
    eventSource.onmessage = (event) => {

      let _data = JSON.parse(event.data)
      if (Number(_data?.userId) === userInfo?.userId) {
        dispatch(setSnackbar({ isOpen: true, message: "Password resetted successfully", isSuccess: true }))
      }
    };

    eventSource.onerror = (error) => {
      // console.error('Error with SSE connection:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getEnvData = async () => {
    let response = await getRequest(`${configUrl.getEnvData}${envType}`)
    dispatch(setEnvData(response?.data?.data || null))
  }
  const getProfileDetails = async () => {
    var response = await getRequest(`${configUrl.getDetailsById}${userInfo.userId}`)
    dispatch(setProfileDetail(response?.data?.data || null))
  }

  return isAuth ? (
    <>
      <div className="row g-0 m-70">
        <div className="col-md-2">
          <Sidebar />

        </div>
        <div className="col-md-10">
          <div className="px-3">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  ) : (
    <>
      <Navigate to={'/login'} />
    </>
  );
};

export default Dashboard;
