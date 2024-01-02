import React from 'react'
import axios from 'axios'
import { baseUrl, configUrl } from "./api.config"
import { store } from '../store/store'
import { resetAuth, setAccessToken, setExpired, setIsAuth, setSnackbar } from '../store/reducers/ui.reducer'


const axiosInstance = axios.create({
    baseURL: baseUrl
})

const refreshToken = async () => {
    try {
        let token = store.getState().UIStore.auth.refresh_token
        let response = await axios.get(`${baseUrl}${configUrl.refreshToken}${token}`);
        return response
    } catch (err) {
        // console.log("🚀 ~ file: Interceptors.js:14 ~ refreshToken ~ err:====", err)
        store.dispatch(resetAuth())
        store.dispatch(setSnackbar({ isOpen: true, message: "Session expired,Please Login Again", isSuccess: false }))
    }
}

axiosInstance.interceptors.response.use(
    (response) => {
        return new Promise((resolve, reject) => {
            resolve(response);
        })
    },
    async (error) => {
        // console.log("🚀 ~ file: Interceptors.js:31 ~ error:", error)
        const originalRequest = error.config;

        if (error?.response?.status === 401 && error?.response?.data?.message && (error?.response?.data?.message).toLowerCase() === "token expired" && !originalRequest._retry) {
            originalRequest._retry = true;

            const rs = await refreshToken();
            const { token } = rs.data.data;
            store.dispatch(setAccessToken(token))
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            return axiosInstance(originalRequest);
        }
        return new Promise((resolve, reject) => {
            reject(error);
        });
    }
);



axiosInstance.interceptors.request.use(
    (request) => {
        let authToken = store.getState().UIStore.access_token
        request.headers["Authorization"] = `Bearer ${authToken}`

        return new Promise((resolve, reject) => {
            resolve(request);
        })
    },
    (error) => {
        if (!error.request) {
            return new Promise((resolve, reject) => {
                reject(error);
            });
        }
    }
);

export default axiosInstance;