import React from 'react'
import { PostRequestHook } from '../../apis/Services';
import { Button, Form } from 'react-bootstrap';
import { PasswordShowHide } from '../../components/PasswordShow/PasswordShowHide';
import { RegEx } from '../../utils/RegEx';
import { useFormik } from 'formik';
import './user.scss'
import { Input_element } from '../../components/input_field/Input_element';
import { Selectelement } from '../../components/Select_field/Selectelement';
import { configUrl } from '../../apis/api.config';
import { useEffect } from 'react';

export const CreateUser = (props) => {
    const { snackBarContent, data, isEditUser, setCreateUser, refreshtable } = props
    const { postRequest, putRequest } = PostRequestHook()

    useEffect(() => {
        if (Object.keys(data).length > 0 && isEditUser) {
            formik.setValues({
                userName: data.userName,
                email: data.email,
                userRole: data.userRole,
                userDob: data.userDob,
                gender: data.gender,
                userPhoneNumber: data.userPhoneNumber,
                password: "",
                userPassword: ""
            })
        } else {
            formik.setValues({
                userName: "",
                email: "",
                userRole: "",
                userDob: "",
                gender: "",
                userPhoneNumber: "",
                password: "",
                userPassword: ""
            })
        }
    }, [isEditUser, data])

    const formik = useFormik({
        initialValues: {
            userName: "",
            email: "",
            userRole: "",
            userDob: "",
            gender: "",
            userPhoneNumber: "",
            password: "",
            userPassword: ""
        },
        validate: (values) => {
            let errors = {};
            if (!values.userName) {
                errors.userName = "Required";
            }
            if (!values.userRole) {
                errors.userRole = "Required";
            }
            if (!values.email) {
                errors.email = "Required";
            } else if (!RegEx.email__regEx.test(values.email)) {
                errors.email = "Provide valid email";
            }
            if (!values.userDob) {
                errors.userDob = "Required";
            }
            if (!values.gender) {
                errors.gender = "Required";
            }
            if (!values.userPhoneNumber) {
                errors.userPhoneNumber = "Required";
            } else if (!RegEx.phone__regEx.test(values.userPhoneNumber)) {
                errors.userPhoneNumber = "Please enter valid number";
            }
            if (!values.password && !isEditUser) {
                errors.password = "Required";
            } else if (!isEditUser && !RegEx.password__regEx.test(values.password)) {
                errors.password = "Must Contain min 8 Characters,atleast 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character";
            }
            if (!isEditUser && !values.userPassword) {
                errors.userPassword = "Required";
            } else if (!isEditUser && values.userPassword != values.password) {
                errors.userPassword = "must match with Password";
            }
            return errors;
        },
        onSubmit: (values) => {
            let value2 = { ...values, userPhoneNumber: values.userPhoneNumber.toString() }
            delete value2.password

            let value3 = { ...value2 }
            delete value3.userPassword
            delete value3.email
            handleCreateUser(isEditUser ? value3 : value2)
        },
    });

    const handleCreateUser = async (data2) => {
        let response = isEditUser ? await putRequest(`${configUrl.updateUser}${data?.userId}`, data2) : await postRequest(configUrl.createuser, data2)
        // console.log("🚀 ~ file: CreateUser.js:100 ~ handleCreateUser ~ response:", response)
        if (response?.status === 201 || response?.status === 200) {
            snackBarContent(true, response?.data?.message)
            refreshtable()
            setCreateUser(false)
        } else {
            snackBarContent(false, response?.response?.data?.message || "server error")
        }
    }

    return (
        <>
            <div className='newuser my-5'>
                <h4 className='mb-4 text-white'>{isEditUser ? "Edit User" : "Add New User"}</h4>
                <div>
                    <Form onSubmit={formik.handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <Input_element input_label="Name" id="userName"
                                    type="text" name="userName" lableClass="font_color"
                                    handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                    value={formik.values.userName}
                                    placeholder="Enter name"
                                    formikValidation={formik.touched.userName && formik.errors.userName ?
                                        <small className='text-danger position-absolute'>{formik.errors.userName}</small>
                                        : null}
                                />
                            </div>
                            <div className="col-md-6">
                                <Input_element input_label="Email" id="email"
                                    type="email" name="email" lableClass="font_color"
                                    handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    placeholder="Enter name"
                                    formikValidation={formik.touched.email && formik.errors.email ?
                                        <small className='text-danger position-absolute'>{formik.errors.email}</small>
                                        : null}
                                    disabled={isEditUser ? true : false}
                                />
                            </div>
                            <div className="col-md-6">
                                <Selectelement select_Label="Gender" lableClass="font_color" name="gender" id="gender"
                                    handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                    value={formik.values.gender}
                                    optionArray={<>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="Other">Other</option>
                                    </>}
                                    formikValidation={formik.touched.gender && formik.errors.gender ?
                                        <small className='text-danger position-absolute'>{formik.errors.gender}</small>
                                        : null}
                                />
                            </div>
                            <div className="col-md-6">
                                <Input_element input_label="Date of Birth" id="userDob"
                                    type="date" name="userDob" lableClass="font_color"
                                    handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                    value={formik.values.userDob}
                                    placeholder="Enter name"
                                    formikValidation={formik.touched.userDob && formik.errors.userDob ?
                                        <small className='text-danger position-absolute'>{formik.errors.userDob}</small>
                                        : null}
                                />
                            </div>
                            <div className="col-md-6">
                                <Input_element input_label="Phone Number" id="userPhoneNumber"
                                    type="number" name="userPhoneNumber" lableClass="font_color"
                                    handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                    value={formik.values.userPhoneNumber}
                                    placeholder="Enter name"
                                    formikValidation={formik.touched.userPhoneNumber && formik.errors.userPhoneNumber ?
                                        <small className='text-danger position-absolute'>{formik.errors.userPhoneNumber}</small>
                                        : null}
                                />
                            </div>
                            <div className="col-md-6">
                                <Selectelement select_Label="Role" lableClass="font_color" name="userRole" id="userRole"
                                    handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                    value={formik.values.userRole}
                                    optionArray={<>
                                        <option value="1">Admin</option>
                                        <option value="2">User</option>
                                    </>}
                                    formikValidation={formik.touched.userRole && formik.errors.userRole ?
                                        <small className='text-danger position-absolute'>{formik.errors.userRole}</small>
                                        : null}
                                />
                            </div>
                            {!isEditUser && <>
                                <div className="col-md-6">
                                    <PasswordShowHide
                                        id="password"
                                        name="password"
                                        input_label="Password"
                                        lableClass="font_color"
                                        handleChange={formik.handleChange}
                                        value={formik.values.password}
                                        handleBlur={formik.handleBlur}
                                        placeholder="Enter Password"
                                        formikValidation={formik.touched.password && formik.errors.password ? (
                                            <>
                                                <span className="text-danger error_font">{formik.errors.password}</span>
                                            </>
                                        ) : null}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <PasswordShowHide
                                        id="userPassword"
                                        name="userPassword"
                                        input_label="Confirm Password"
                                        lableClass="font_color"
                                        placeholder="Confirm Password"
                                        handleChange={formik.handleChange}
                                        handleBlur={formik.handleBlur}
                                        value={formik.values.userPassword}
                                        formikValidation={formik.touched.userPassword && formik.errors.userPassword ? (
                                            <>
                                                <span className="text-danger small">{formik.errors.userPassword}</span>
                                            </>
                                        ) : null}
                                    />
                                </div>
                            </>}
                        </div>

                        <div className='text-end mt-4'>
                            <Button id='submitbutton' type="submit" className="btn_submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}
