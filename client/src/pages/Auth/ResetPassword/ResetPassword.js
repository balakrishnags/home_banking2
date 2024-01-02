import React, { useEffect, useState } from 'react'
import { Input_element } from '../../../components/input_field/Input_element';
import { Button, Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import { Link, useLocation, useParams } from 'react-router-dom';
import { RegEx } from '../../../utils/RegEx';
import { PostRequestHook } from '../../../apis/Services';
import { configUrl } from '../../../apis/api.config';
import { PasswordShowHide } from '../../../components/PasswordShow/PasswordShowHide';
import { SnackBar } from '../../../components/SnackBars/SnackBar';
import { RouteStrings } from '../../../utils/common';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../../../store/reducers/ui.reducer';


export const ResetPassword = () => {
    const [isSet, setIsSet] = useState(false);
    let [searchParams, setSearchParams] = useState();
    let [tokenexpired, setTokenExpired] = useState(false);

    const { postRequest, getRequest } = PostRequestHook()

    const dispatch = useDispatch()

    const location = useLocation()
    useEffect(() => {
        let url = new URLSearchParams(location.search)
        var token = url.get("token")
        if (token) {
            setSearchParams(token)
        }
    }, [])

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
                errors.newPassword = "Must Contain min 8 Characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character";
            }
            if (!values.confirmPassword) {
                errors.confirmPassword = "Required";
            } else if (values.confirmPassword != values.newPassword) {
                errors.confirmPassword = "must match with New Password";
            }
            return errors;
        },
        onSubmit: async (values) => {
            var values2 = { newpassword: values.newPassword, confirmpassword: values.confirmPassword }
            let url = `${configUrl.resetPassword}${searchParams}`
            var response = await postRequest(url, values2)
            if (response.status == 200) {
                setIsSet(true)
            } else if (response.response.data.status == 401) {
                setIsSet(true)
                setTokenExpired(true)
            } else if (response.response.data.status == 409 || response.response.data.status == 400) {
                dispatch(setSnackbar({ isOpen: true, message: response.response.data.message, isSuccess: false }))
            }
        },
    });


    return (
        <>
            {isSet ? <>
                {tokenexpired ? <div div className="formforgot_width" >
                    <h6 className="font_color">
                        URL Expired for Reset Password ,click the below link to generate new Reset Password URL
                    </h6>
                    <div className="text-center mt-4">
                        <p className="font_color m-0">
                            Click Here to
                            <Link to={'/forgotpassword'} className="forgot_link">
                                Reset Password
                            </Link>
                        </p>
                    </div>
                </div > :
                    <div div className="formforgot_width" >
                        <h6 className="font_color">
                            Reset Password is completed,click the below Button to go login page
                        </h6>
                        <div className="text-center mt-4">
                            <p className="font_color m-0">
                                Click Here to
                                <Link to={"/login"} className="forgot_link">
                                    login
                                </Link>
                            </p>
                        </div>
                    </div >
                }

            </> :
                <>
                    <div className="my-4 text-center">
                        <h3 className="header_color">Reset Password</h3>
                    </div>
                    <div className="formsignin_width">
                        <Form onSubmit={formik.handleSubmit} autoComplete="off">
                            <PasswordShowHide
                                id="newPaassword"
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
                                id="confirmPassword"
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

                            <Button id='submitbutton' type="submit" className="btn_submit">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </>
            }
        </>


    );
}
