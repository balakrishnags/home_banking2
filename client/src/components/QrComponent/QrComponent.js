import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { PostRequestHook } from '../../apis/Services';
import { configUrl } from '../../apis/api.config';
import { setAccessToken, setIsAuth, setScannerModal, setSessionScannerId, setSnackbar } from '../../store/reducers/ui.reducer';
import { RouteStrings } from '../../utils/common';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { store } from '../../store/store';
import { ENVDATA } from '../../Conflict/Conflct';

export const QrComponent = (props) => {
    const { scannerView } = props
    const { userInfo } = useSelector(state => state.UIStore)

    const { getRequest, postRequest } = PostRequestHook()

    const [qr, setQr] = useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const eventSource = new EventSource(`${ENVDATA.baseUrl}/sse/verifyQrscan`);

        eventSource.onmessage = (event) => {
            let _sessionId = store.getState().UIStore.sessionScanId
            let data = JSON.parse(event.data)
            if (data.sessionId == _sessionId) {
                handleQRSignin(data)
            }
        };

        eventSource.onerror = (error) => {
            console.error('Error with SSE connection:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    const handleQRSignin = (data) => {
        dispatch(setSnackbar({ isOpen: true, message: "User logged in successfully", isSuccess: true }))
        dispatch(setAccessToken(data?.token))
        dispatch(setIsAuth({
            isAuth: true,
            data: { email: data.email, role: data.roleId, userId: data.userId },
            refresh_token: data.refreshtoken
        }));
        navigate(RouteStrings.dashboard, { replace: true })
    }

    const handleError = (err) => {
        console.error("err=====>", err);
    };

    const handleScanResult = (result) => {
        if (result) {
            dispatch(setScannerModal(false))
            let _data = { userId: userInfo.userId, qrcode: result }
            verifyQR(_data)
        }
    };


    const generateQrCode = async () => {
        let response = await getRequest(configUrl.generateQr)
        setQr(response?.data?.data.url || '')
        dispatch(setSessionScannerId(response?.data?.data.sessionId || ''))
    }

    const verifyQR = async (payload) => {
        let response = await postRequest(configUrl.verifyQr, payload)
        // console.log("🚀 ~ verifyQR ~ response:", response)
    }

    return (
        <>
            {!scannerView && <div className="text-center mb-5">
                {qr ? <img src={qr} alt="qrcode" /> :
                    <button type='buttton' className='btn btn-primary' onClick={() => generateQrCode()}>Generate Qr code</button>}
            </div>}
            {scannerView && <div className="">
                <QrScanner
                    onDecode={handleScanResult}
                    onError={handleError}
                    constraints={{
                        facingMode: "environment"
                    }}
                />
            </div>}

        </>
    )
}
