import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './Dashboard.scss'
import { TotalChart } from './TotalChart'

export const Dashboard2 = () => {
    const { userInfo, profileDetail } = useSelector(state => state.UIStore)
    // console.log("🚀 ~ file: Dashboard2.js:8 ~ Dashboard2 ~ profileDetail:", profileDetail)
    let userId = userInfo?.userId || null

    return (
        <div className='my-5 mx-md-3 mx-lg-4'>
            <h2>Hi {profileDetail && profileDetail[0]?.userName}, Welcome to Home Banking </h2>

            <TotalChart userId={userId} isDashBoard={true} />
        </div>
    )
}
