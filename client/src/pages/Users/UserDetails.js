import React from 'react'
import { PostRequestHook } from '../../apis/Services';
import { Button, Form } from 'react-bootstrap';
import { PasswordShowHide } from '../../components/PasswordShow/PasswordShowHide';
import { RegEx } from '../../utils/RegEx';
import { useFormik } from 'formik';
import './user.scss'
import { configUrl } from '../../apis/api.config';
import { ModalComponent } from '../../components/modal/ModalComponent';
import { useState } from 'react';
import { useEffect } from 'react';
import { TotalChart } from '../Dashboard/TotalChart';
import { CommonCreditScreen } from '../Credit/CommonCreditScreen';

export const UserDetails = (props) => {
    const { snackBarContent, userDetail, setCreateUser, refreshtable, setViewDetails, userId, setEditUser, isChange, isUserView, setUserView } = props
    const { putRequest, deleteRequest } = PostRequestHook()

    const [userDeleteModal, setUserDeleteModal] = useState(false)
    const [isChangePassword, setChangePassword] = useState(false)
    const [isUserType, setUserType] = useState('')

    useEffect(() => {
        if (!isChange) {
            setChangePassword(true)
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            newpassword: "",
            confirmpassword: "",
        },
        validate: (values) => {
            let errors = {};
            if (!values.newpassword) {
                errors.newpassword = "Required";
            } else if (!RegEx.password__regEx.test(values.newpassword)) {
                errors.newpassword = "Must Contain min 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character";
            }
            if (!values.confirmpassword) {
                errors.confirmpassword = "Required";
            } else if (values.confirmpassword != values.newpassword) {
                errors.confirmpassword = "must match with New Password";
            }
            return errors;
        },
        onSubmit: async (values) => {
            let data2 = { userPassword: (values.newpassword).trim() }
            let response = await putRequest(`${configUrl.updateUser}${userDetail?.userId}`, data2)
            // console.log("🚀 ~ file: ChangePassword.js:37 ~ onSubmit: ~ response:", response)
            if (response?.status === 201 || response?.status === 200) {
                snackBarContent(true, response?.data?.message)
                refreshtable()
                setCreateUser(false)
            } else {
                snackBarContent(false, response?.response?.data?.message || "server error")
            }
        },
    });

    // delete user
    const handleDeleteUser = async (data) => {
        let response = await deleteRequest(`${configUrl.deleteUser}${data}`)
        if (response?.status === 200) {
            refreshtable()
            snackBarContent(true, response?.data?.message)
            setUserDeleteModal(false)
            setCreateUser(false)
        } else if (response?.response?.status === 404) {
            snackBarContent(false, response?.response?.data?.message)
        } else {
            snackBarContent(false, "Internal Server Error")
        }
    }

    return (
        <>
            {!isUserView && <div className='changepassworddiv my-5'>

                <div className="mb-5">
                    <>{Object.keys(userDetail).length > 0 &&
                        <div className='div_border'>
                            <div className="row">
                                <div className="col-md-6">
                                    <p className='mb-2'>Name : <strong>{userDetail.userName}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className='mb-2'>Email : <strong>{userDetail.email}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className='mb-2'>Gender : <strong>{userDetail.gender}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className='mb-2'>Date of Birth : <strong>{userDetail.userDob}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className='mb-2'>Contact Number : <strong>{userDetail.userPhoneNumber}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className='mb-2'>Role : <strong>{userDetail.userRole == 1 ? "Admin" : "User"}</strong></p>
                                </div>
                            </div>
                        </div>}
                        {isChange && <div className='d-flex justify-content-end gap-3 mt-4'>
                            {userId !== userDetail.userId && <>
                                <button type="button" className='btn btn-danger' onClick={() => {
                                    setChangePassword(false)
                                    setUserDeleteModal(true)
                                }}>Remove User</button>
                                {!isChangePassword && <button type="button" className='btn btn-success' onClick={() => {
                                    setEditUser(false)
                                    setCreateUser(true)
                                    setChangePassword(true)
                                }}>Change Password</button>}
                            </>
                            }
                            <button type="button" className='btn btn-primary' onClick={() => {
                                setEditUser(true)
                                setCreateUser(true)
                                setChangePassword(false)
                                setViewDetails(false)
                            }}>Edit Details</button>
                        </div>}
                    </>
                </div>
                {!isChangePassword && <>
                    <TotalChart userId={userDetail?.userId} isDashBoard={false} setUserView={setUserView} setUserType={setUserType} />
                </>}

                {/* change password */}
                {isChangePassword &&
                    <div className='change_password'>
                        <h4 className='mb-4 text-light'>Change Password</h4>
                        <Form onSubmit={formik.handleSubmit} autoComplete="off">
                            <PasswordShowHide
                                id="newpassword"
                                name="newpassword"
                                input_label="New Password"
                                lableClass="font_color"
                                handleChange={formik.handleChange}
                                value={formik.values.email}
                                handleBlur={formik.handleBlur}
                                placeholder="Enter Password"
                                formikValidation={formik.touched.newpassword && formik.errors.newpassword ? (
                                    <>
                                        <span className="text-danger error_font">{formik.errors.newpassword}</span>
                                    </>
                                ) : null}
                            />


                            <PasswordShowHide
                                id="confirmpassword"
                                name="confirmpassword"
                                input_label="Confirm Password"
                                lableClass="font_color"
                                placeholder="Confirm Password"
                                handleChange={formik.handleChange}
                                handleBlur={formik.handleBlur}
                                value={formik.values.password}
                                formikValidation={formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                                    <>
                                        <span className="text-danger small">{formik.errors.confirmpassword}</span>
                                    </>
                                ) : null}
                            />
                            <div className="d-flex justify-content-end gap-3 mt-5">
                                {isChange && <Button id='closebutton' type="button" className="btn btn-light" onClick={() => {
                                    setChangePassword(false)
                                    formik.resetForm()
                                }}>
                                    Close
                                </Button>}
                                <Button id='submitbutton' type="submit" className="btn_submit">
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </div>
                }
            </div>}
            {/* {isUserView && <SampleCreditList userDetail={userDetail} setUserView={setUserView} type={isUserType} />} */}
            {isUserView && <CommonCreditScreen userDetail={userDetail} setCreateUser={setCreateUser}
                setUserView={setUserView} type={isUserType} isAdmin={true} />}

            {/*  user delete modal */}
            <ModalComponent
                show={userDeleteModal} size={"lg"} onHide={() => {
                    setUserDeleteModal(false)
                    // setUserModal(true)
                }}
                modal_header={<><h4>Remove User</h4></>}
                modal_body={
                    <>
                        <h5>Are you certain that you want to remove the User - {userDetail?.userName || ""} ?</h5>
                        <div className='d-flex justify-content-end gap-3 mt-5'>
                            <button type="button" className='btn btn-primary' onClick={() => {
                                setUserDeleteModal(false)
                                // setUserModal(true)
                            }}>Back</button>
                            <button type="button" className='btn btn-danger' onClick={() => handleDeleteUser(userDetail?.userId || "")}>Remove</button>
                        </div>
                    </>
                }
            />
        </>
    )
}
