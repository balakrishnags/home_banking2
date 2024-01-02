import React from "react";
//  axiosInstance Get Request
import { useDispatch } from "react-redux";
import axiosInstance from "./Interceptors";
import { setLoader } from "../store/reducers/ui.reducer";


export const PostRequestHook = () => {

    const dispatch = useDispatch()

    const postRequest = async (url, data) => {
        dispatch(setLoader(true))
        try {
            const response = await axiosInstance.post(url, data);
            return response;
        } catch (error) {
            return error;
        } finally {
            dispatch(setLoader(false))
        }
    }

    const putRequest = async (url, data = {}) => {
        dispatch(setLoader(true))
        try {
            const response = await axiosInstance.put(url, data);
            return response;
        } catch (error) {
            return error;
        } finally {
            dispatch(setLoader(false))
        }
    }

    const deleteRequest = async (url, data) => {
        dispatch(setLoader(true))
        try {
            const response = await axiosInstance.delete(url, data || null);
            return response;
        } catch (error) {
            return error
        } finally {
            dispatch(setLoader(false))
        }
    }

    const getRequest = async (url) => {
        dispatch(setLoader(true))
        try {
            const response = await axiosInstance.get(url);
            return response
        } catch (error) {
            return error.response
        } finally {
            dispatch(setLoader(false))
        }
    }

    return { postRequest, putRequest, deleteRequest, getRequest }
}
