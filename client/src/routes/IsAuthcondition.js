import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { RouteStrings } from '../utils/common';


export const IsAuthcondition = () => {
    const { auth: { isAuth }, userInfo } = useSelector((state) => state.UIStore);
    return (
        <>
            {isAuth ? <Navigate to={RouteStrings.dashboard} replace /> : <Outlet />}
        </>
    )
}