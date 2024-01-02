import { Box, CircularProgress, Fade } from '@mui/material'
import React from 'react'
import "./spinner.scss"

export const Spinner = (props) => {
    const { spin } = props
    return (
        <div className={`spinnerstyle ${spin ? "" : "d-none"}`}>
            <div>
                <CircularProgress />
            </div>
        </div>
    )
}