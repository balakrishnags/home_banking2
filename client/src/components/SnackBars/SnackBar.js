import React from 'react'
import { Alert, Snackbar } from '@mui/material'
import "./snackbar.scss"

export const SnackBar = (props) => {
    const { snackbarOpen, handleClose, message, snackbg } = props;

    return (
        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleClose} className='snackbardiv'>
            <Alert onClose={handleClose} severity={snackbg ? "success" : "error"} sx={{ width: '100%' }} className={`snack_style ${snackbg ? "bg-success" : "bg-danger"}`}>
                {message}
            </Alert>
        </Snackbar>
    )
}