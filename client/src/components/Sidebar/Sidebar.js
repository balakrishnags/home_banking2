import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { RouteStrings } from "../../utils/common";
import "./Sidebar.scss";
import { useDispatch, useSelector } from "react-redux";
import { setViewSidebar, setScreenWidth } from "../../store/reducers/ui.reducer";
import Accordion from 'react-bootstrap/Accordion';

export const Sidebar = () => {
  const { isSidebarOpen, userInfo } = useSelector(state => state.UIStore)

  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 768;
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setScreenWidth(window.innerWidth))
    const handleWindowResize = () => {
      setWidth(window.innerWidth)
      dispatch(setScreenWidth(window.innerWidth))
    };
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  const handleClickLink = () => {
    dispatch(setViewSidebar(!isSidebarOpen))
  }

  return (
    <div className={`sidebar ${isSidebarOpen ? width < breakpoint ? "mob" : "" : 'close'}`}>
      <div className="sidebar_options">
        <Accordion>
          <div>
            <NavLink id="navlink_1" to={RouteStrings.dashboard} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Dashboard
            </NavLink>
          </div>
          {userInfo?.role === 1 &&
            <Accordion.Item eventKey="1">
              <Accordion.Header>Users</Accordion.Header>
              <Accordion.Body>
                <div>
                  <NavLink id="navlink_2" to={RouteStrings.users} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Users List
                  </NavLink>
                </div>

                <div>
                  <NavLink id="navlink_3" to={RouteStrings.userpassword} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
                    Password Request
                  </NavLink>
                </div>
              </Accordion.Body>
            </Accordion.Item>}
          <div>
            <NavLink id="navlink_4" to={RouteStrings.creditlist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Credit
            </NavLink>
          </div>
          <div>
            <NavLink id="navlink_5" to={RouteStrings.debitlist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Debit
            </NavLink>
          </div>
          <div>
            <NavLink id="navlink_6" to={RouteStrings.lendinglist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Lending
            </NavLink>
          </div>
          <div>
            <NavLink id="navlink_6" to={RouteStrings.borrowedlist} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Borrow
            </NavLink>
          </div>
          {/* <div>
            <NavLink id="navlink_6" to={RouteStrings.envdata} activeclassname="active" className="sidebar_link" onClick={handleClickLink}>
              Env Data
            </NavLink>
          </div> */}
        </Accordion>

      </div>
    </div >
  );
};
