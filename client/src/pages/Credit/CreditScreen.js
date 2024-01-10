import React from 'react'
import { CommonCreditScreen } from './CommonCreditScreen'
import { useSelector } from 'react-redux'

export const CreditScreen = () => {
    const { userInfo } = useSelector(state => state.UIStore)
    let userId = userInfo?.userId || null

    return (
        <>
            <CommonCreditScreen userDetail={{ userId }} setUserView={() => { }} type={"credit"}
                isAdmin={false} />
        </>
    )
}
