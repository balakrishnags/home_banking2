import React from 'react'
import { Button, Modal } from 'react-bootstrap'

export const LogoutModal = (props) => {
    const { logoutModal, handleLogout } = props
    return (
        <>
            <Modal
                show={logoutModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Body className='text-center m-5'>
                    <h5 className='text-light'>Your Session Expired, Please LogIn Again</h5>
                    <Button className='btn btn-light mt-3' onClick={handleLogout}>Login</Button>
                </Modal.Body >
            </Modal >
        </>
    )
}
