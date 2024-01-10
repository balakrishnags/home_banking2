import { useFormik } from 'formik';
import React from 'react'
import { PostRequestHook } from '../../apis/Services';
import { Input_element } from '../input_field/Input_element';
import { Button, Form } from 'react-bootstrap';
import './dataform.scss'
import { useSelector } from 'react-redux';
import { configUrl } from '../../apis/api.config';
import { useEffect } from 'react';

export const DataForm = (props) => {
    const { formData, type, snackBarContent, refreshtable, setCreateData, isUpdate, userId } = props

    const { putRequest, postRequest } = PostRequestHook()

    useEffect(() => {
        if (isUpdate && formData) {
            formik.setValues({
                description: formData.description,
                creditDate: formData.creditDate,
                creditAmount: formData.creditAmount
            })
        } else {
            formik.setValues({
                description: "",
                creditDate: "",
                creditAmount: ""
            })
        }
    }, [])

    const formik = useFormik({
        initialValues: {
            description: "",
            creditDate: "",
            creditAmount: ""
        },
        validate: (values) => {
            let errors = {};
            if (!values.creditAmount) {
                errors.creditAmount = "Required";
            }
            if (!values.creditDate) {
                errors.creditDate = "Required";
            }
            if (!values.description) {
                errors.description = "Required";
            }
            return errors;
        },
        onSubmit: async (values) => {
            let value2 = { ...values, userId: userId, type: type }

            let api = isUpdate ? `${configUrl.updateCreditDebit}${formData?.creditId}` : configUrl.addcreditdebit
            handleCreditDebitData(api, value2)
        },
    });

    const handleCreditDebitData = async (api, data) => {
        let response = isUpdate ? await putRequest(api, data) : await postRequest(api, data)
        if (response?.status === 201 || response?.status === 200) {
            snackBarContent(true, response?.data?.message)
            refreshtable()
            setCreateData(false)
        } else {
            snackBarContent(false, response?.response?.data?.message || "server error")
        }
    }


    return (
        <>
            <div className='form_div'>
                <Form onSubmit={formik.handleSubmit} autoComplete="off">
                    <div className="row">
                        <div className="col-md-6">
                            <Input_element input_label={`${type} amount(Rs.)`} id="amount"
                                type="number" name="creditAmount" lableClass="font_color"
                                handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                value={formik.values.creditAmount}
                                placeholder="Enter amount"
                                formikValidation={formik.touched.creditAmount && formik.errors.creditAmount ?
                                    <small className='text-danger position-absolute'>{formik.errors.creditAmount}</small>
                                    : null}
                            />
                        </div>
                        <div className="col-md-6">
                            <Input_element input_label={`${type} Date`} id="creditDate"
                                type="date" name="creditDate" lableClass="font_color"
                                handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                value={formik.values.creditDate}
                                placeholder="Enter name"
                                formikValidation={formik.touched.creditDate && formik.errors.creditDate ?
                                    <small className='text-danger position-absolute'>{formik.errors.creditDate}</small>
                                    : null}
                            />
                        </div>
                        <div className="col-md-6">
                            <div className='position-relative mb-3'>
                                <div>
                                    <label htmlFor="Description" className='font_color mb-2'>Description</label>
                                </div>
                                <textarea rows={3}
                                    name='description'
                                    id='description'
                                    className='textAreaClass'
                                    placeholder='description...'
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                ></textarea>
                                <div>{formik.touched.description && formik.errors.description ?
                                    <small className='text-danger position-absolute'>{formik.errors.description}</small>
                                    : null}</div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end gap-3 mt-4">
                        <Button id='submitbutton' type="submit" className="btn_submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    )
}
