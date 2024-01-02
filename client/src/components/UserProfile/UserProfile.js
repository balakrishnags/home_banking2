import React, { useState, useEffect } from 'react'
import { useFormik } from "formik";
import './userprofile.scss'
import { useDispatch, useSelector } from 'react-redux';
import { PostRequestHook } from '../../apis/Services';
import { configUrl } from '../../apis/api.config';
import { RegEx } from '../../utils/RegEx';
import { PasswordShowHide } from '../PasswordShow/PasswordShowHide';
import { Button } from 'react-bootstrap';
import { Tabs, Tab } from 'react-bootstrap';
import { setSnackbar } from '../../store/reducers/ui.reducer';

export const UserProfile = () => {
    const { getRequest, putRequest } = PostRequestHook()
    const { userInfo, profileDetail } = useSelector((state) => state.UIStore);
    const dispatch = useDispatch()

    // const [profileData, setProfileData] = useState([])


    // useEffect(() => {
    //     getProfileDetails()
    // }, [])


    // const getProfileDetails = async () => {
    //     var response = await getRequest(`${configUrl.getDetailsById}${userInfo.userId}`)
    //     setProfileData(response?.data?.data || [])
    // }


    const formik = useFormik({
        initialValues: {
            currentpassword: "",
            newpassword: "",
            confirmpassword: "",
        },
        validate: (values) => {
            let errors = {};
            if (!values.currentpassword) {
                errors.currentpassword = "Enter current password";
            }
            if (!values.newpassword) {
                errors.newpassword = "Password is required";
            } else if (!RegEx.password__regEx.test(values.newpassword)) {
                errors.newpassword = "Must Contain min 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character";
            }
            if (!values.confirmpassword || (values.confirmpassword != values.newpassword)) {
                errors.confirmpassword = "Must match with New Password";
            }

            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            var response = await putRequest(`${configUrl.updatePassword}${userInfo.userId}`, values)
            if (response) {
                if (response.status == 201 || response.status == 200) {
                    dispatch(setSnackbar({ isOpen: true, message: response.data.message, isSuccess: true }))
                    resetForm()
                } else if (response.response.data.status == 400 || response.response.data.status == 401) {
                    dispatch(setSnackbar({ isOpen: true, message: response.response.data.message, isSuccess: false }))
                }
            }
        }
    });



    return (
        <>
            <div className='w-800'>
                <h3 className=''>User Profile</h3>
            </div>

            <div div className='userprofile_div rounded' >
                <Tabs defaultActiveKey="tab1" id="my-tabs" className='profile_tab'>
                    <Tab eventKey="tab1" className='font_color' title="Profile Details">
                        <div className='mt-4'>
                            {profileDetail && profileDetail.length > 0 && profileDetail.map((item, i) => {
                                return (
                                    <div key={i}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p className='mb-2'>Name : <strong>{item.userName}</strong></p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className='mb-2'>Email : <strong>{item.email}</strong></p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className='mb-2'>Gender : <strong>{item.gender}</strong></p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className='mb-2'>Date of Birth : <strong>{item.userDob}</strong></p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className='mb-2'>Contact Number : <strong>{item.userPhoneNumber}</strong></p>
                                            </div>
                                            <div className="col-md-6">
                                                <p className='mb-2'>Role : <strong>{item.userRole == 1 ? "Admin" : "User"}</strong></p>
                                            </div>
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                    </Tab>
                    {userInfo?.role === 1 &&
                        <Tab eventKey="tab2" title="Change Password">
                            <div className="mt-4 mt-md-5 px-md-5">
                                <form onSubmit={formik.handleSubmit}>
                                    <PasswordShowHide
                                        name="currentpassword"
                                        input_label="Current Password *"
                                        lableClass="font_color"
                                        placeholder="Enter Current Password"
                                        handleChange={formik.handleChange}
                                        handleBlur={formik.handleBlur}
                                        value={formik.values.currentpassword}
                                        formikValidation={formik.touched.currentpassword && formik.errors.currentpassword ? (
                                            <>
                                                <span className="text-danger small">{formik.errors.currentpassword}</span>
                                            </>
                                        ) : null}
                                    />
                                    <PasswordShowHide
                                        name="newpassword"
                                        input_label="New Password *"
                                        lableClass="font_color"
                                        placeholder="Enter New Password"
                                        handleChange={formik.handleChange}
                                        handleBlur={formik.handleBlur}
                                        value={formik.values.newpassword}
                                        formikValidation={formik.touched.newpassword && formik.errors.newpassword ? (
                                            <>
                                                <span className="text-danger small">{formik.errors.newpassword}</span>
                                            </>
                                        ) : null}
                                    />
                                    <PasswordShowHide
                                        name="confirmpassword"
                                        input_label="Confirm Password *"
                                        lableClass="font_color"
                                        placeholder="Enter Confirm Password"
                                        handleChange={formik.handleChange}
                                        handleBlur={formik.handleBlur}
                                        value={formik.values.confirmpassword}
                                        formikValidation={formik.touched.confirmpassword && formik.errors.confirmpassword ? (
                                            <>
                                                <span className="text-danger small">{formik.errors.confirmpassword}</span>
                                            </>
                                        ) : null}
                                    />
                                    <div className="text-end mt-4">
                                        <Button id='passwordbtn' type="submit" className="btn_submit">
                                            Update Password
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </Tab>}
                </Tabs>
            </div >
        </>
    )
}
