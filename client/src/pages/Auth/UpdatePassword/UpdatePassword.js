import React, { useState } from 'react'
import { PasswordShowHide } from '../../../components/PasswordShow/PasswordShowHide'
import { Button, Form, Modal } from 'react-bootstrap'
import { SnackBar } from '../../../components/SnackBars/SnackBar'
import { useFormik } from 'formik'
import { configUrl } from '../../../apis/api.config'
import { RegEx } from '../../../utils/RegEx'
import { PostRequestHook } from '../../../apis/Services'
import { useSelector } from 'react-redux'

export const UpdatePassword = (props) => {
    const { updateModal, handleClick } = props

    const [isSet, setIsSet] = useState(false);
    const [snackOpen, setSnackOpen] = useState(false)
    const [snackMessage, setSnackMessage] = useState("")

    const { postRequest } = PostRequestHook()

    const { userInfo } = useSelector((state) => state.UIStore);
    // const employeeMail = userInfo ? userInfo.work_email : null
    // const organization_name = userInfo ? userInfo.organization_name : null

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validate: (values) => {
            let errors = {};
            if (!values.newPassword) {
                errors.newPassword = "Required";
            } else if (!RegEx.password__regEx.test(values.newPassword)) {
                errors.newPassword = "Must Contain 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character";
            }
            if (!values.confirmPassword) {
                errors.confirmPassword = "Required";
            } else if (values.confirmPassword != values.newPassword) {
                errors.confirmPassword = "must match with New Password";
            }
            return errors;
        },
        onSubmit: async (values) => {
            // let data = { ...values, email: employeeMail, organization_name: organization_name }
            console.log("🚀 ~ file: UpdatePassword.js:45 ~ onSubmit: ~ data:", values)
            // var response = await postRequest(configUrl.subadminupdatePassword, data)
            // if (response.status == 200) {
            //     setIsSet(true)
            // } else if (response.response.data.status == 401 || response.response.data.status == 400) {
            //     setSnackMessage(response.response.data.message)
            //     setSnackOpen(true)
            // }
        },
    });

    const handlesnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    return (
        <>

            <Modal
                show={updateModal}
                // onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title className='text-center'><h3>Update Password</h3></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isSet ? <>
                        <div div className="formforgot_width" >
                            <h6 className="font_color">
                                Password Updated Successfully,Please Login Again
                            </h6>
                            <div className="text-center mt-4">
                                <Button className='btn btn-danger' onClick={handleClick}>Login</Button>
                            </div>
                        </div >
                    </> :
                        <div className="formsignin_width">
                            <Form onSubmit={formik.handleSubmit} autoComplete="off">
                                <PasswordShowHide
                                    name="newPassword"
                                    input_label="New Password"
                                    lableClass="font_color"
                                    handleChange={formik.handleChange}
                                    value={formik.values.email}
                                    handleBlur={formik.handleBlur}
                                    placeholder="Enter Password"
                                    formikValidation={formik.touched.newPassword && formik.errors.newPassword ? (
                                        <>
                                            <span className="text-danger error_font">{formik.errors.newPassword}</span>
                                        </>
                                    ) : null}
                                />


                                <PasswordShowHide
                                    name="confirmPassword"
                                    input_label="Confirm Password"
                                    lableClass="font_color"
                                    placeholder="Confirm Password"
                                    handleChange={formik.handleChange}
                                    handleBlur={formik.handleBlur}
                                    value={formik.values.password}
                                    formikValidation={formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <>
                                            <span className="text-danger small">{formik.errors.confirmPassword}</span>
                                        </>
                                    ) : null}
                                />
                                <Button type="submit" className="btn_submit">
                                    Submit
                                </Button>

                            </Form>
                        </div >
                    }
                </Modal.Body >
            </Modal >

            <SnackBar snackbarOpen={snackOpen} handleClose={handlesnackClose} message={snackMessage} />

        </>
    )
}
