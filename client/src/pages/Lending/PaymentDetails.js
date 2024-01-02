import React, { useState, useEffect, useMemo } from 'react'
import { CommonTable } from '../../components/ReactTable/CommonTable'
import { Images } from '../../utils/images';
import { PostRequestHook } from '../../apis/Services';
import { configUrl } from '../../apis/api.config';
import { useSelector } from 'react-redux';
import { ModalComponent } from '../../components/modal/ModalComponent';
import { useFormik } from 'formik';
import { Button, Form } from 'react-bootstrap';
import { Input_element } from '../../components/input_field/Input_element';

export const PaymentDetails = (props) => {
    const { detail, snackBarContent, refreshTable, paymentType } = props
    const { userInfo } = useSelector(state => state.UIStore)
    let userId = userInfo?.userId || null

    const { getRequest, postRequest, putRequest, deleteRequest } = PostRequestHook()
    const [paymentList, setPaymentList] = useState([])
    const [paymentDetail, setPaymentDetail] = useState([])
    const [paymentModal, setPaymentModal] = useState(false)
    const [paymentDeleteModal, setPaymentDeleteModal] = useState(false)
    const [isEdit, setEdit] = useState(false)
    const [ispaymentstatus, setPaymentStatus] = useState(null)

    useEffect(() => {
        getPaymentDetails()
    }, [detail])

    // get paymentDetails
    const getPaymentDetails = async () => {
        let response = await getRequest(`${configUrl.getPaymentDetails}${userId}/${paymentType === "borrow" ? detail?.borrowId : detail?.lendId}/${paymentType}`)
        setPaymentList(response?.data?.data?.paymentData || [])
        setPaymentStatus(response?.data?.data?.paymentStatus)
    }

    const columns = useMemo(
        () => [
            {
                Header: "Sl. no.",
                accessor: (row, index) => index + 1,
                Cell: ({ value }) => <span>{value}</span>
            },
            {
                Header: "Payment Date",
                accessor: "paymentDate"
            },
            {
                Header: "Description",
                accessor: "paymentDescription",
                Cell: (tableProps) => <span className='word_limit'>{tableProps.cell.row.original.paymentDescription}</span>

            },
            {
                Header: "Payment Amount",
                accessor: "paymentAmount"
            },
            {
                Header: "View/Edit",
                accessor: "action",
                Cell: (tableProps) => {
                    return (
                        <div>
                            <div className="d-flex flex-row justify-content-center align-items-center">
                                <img
                                    src={Images.viewIcon}
                                    alt="icon"
                                    id={`editInventory${tableProps.cell.row.original.payId}`}
                                    className="editIcon"
                                    onClick={() => {
                                        setPaymentDetail(tableProps.cell.row.original)
                                        setPaymentModal(true)
                                        setEdit(true)
                                    }}
                                />
                                <img
                                    src={Images.deleteLogo}
                                    alt="icon"
                                    id={`deleteInventory${tableProps.cell.row.original.payId}`}
                                    className="editIcon mx-2"
                                    onClick={(e) => {
                                        setPaymentDetail(tableProps.cell.row.original)
                                        setPaymentDeleteModal(true)
                                    }}
                                />
                            </div>
                        </div>
                    )
                },
            },
        ], []
    );


    useEffect(() => {
        if (isEdit && paymentDetail) {
            formik.setValues({
                paymentDescription: paymentDetail.paymentDescription,
                paymentDate: paymentDetail.paymentDate,
                paymentAmount: paymentDetail.paymentAmount
            })
        } else {
            formik.setValues({
                paymentDescription: "",
                paymentDate: "",
                paymentAmount: ""
            })
        }
    }, [isEdit])

    const formik = useFormik({
        initialValues: {
            paymentDescription: "",
            paymentDate: "",
            paymentAmount: ""
        },
        validate: (values) => {
            let errors = {};
            if (!values.paymentAmount) {
                errors.paymentAmount = "Required";
            }
            if (!values.paymentDate) {
                errors.paymentDate = "Required";
            }
            if (!values.paymentDescription) {
                errors.paymentDescription = "Required";
            }
            return errors;
        },
        onSubmit: async (values) => {
            let value2 = {
                ...values, userId: userId,
                lendingId: paymentType === "borrow" ? detail.borrowId : detail.lendId,
                type: paymentType
            }
            console.log("🚀 ~ file: PaymentDetails.js:131 ~ onSubmit: ~ value2:", value2)
            handleAddUpdatePayment(value2)
        },
    });

    const handleAddUpdatePayment = async (data) => {
        let response = isEdit ? await putRequest(`${configUrl.updatePaymentDetail}${paymentDetail.payId}`, data) : await postRequest(configUrl.addPaymentDetail, data)
        if (response?.status === 201 || response?.status === 200) {
            refreshTable()
            snackBarContent(true, response?.data?.message)
            getPaymentDetails()
            setPaymentModal(false)
            setEdit(false)
        } else {
            snackBarContent(false, response?.response?.data?.message || "server error")
        }
    }


    // delete payment details
    const handleDeletepayment = async (data) => {
        // console.log("🚀 ~ file: PaymentDetails.js:149 ~ handleDeletepayment ~ data:", data)
        let response = await deleteRequest(`${configUrl.deletePaymentDetail}${userId}/${data.lendId || data.borrowId}/${data.payId}/${paymentType}`)
        if (response?.status === 201 || response?.status === 200) {
            refreshTable()
            snackBarContent(true, response?.data?.message)
            getPaymentDetails()
            setPaymentDeleteModal(false)
            setEdit(false)
        } else {
            snackBarContent(false, response?.response?.data?.message || "server error")
        }
    }

    return (
        <>
            <div className='my-5'>
                <h4 className='mb-4'>Payment Details</h4>
                <div>
                    {paymentList.length > 0 && <>
                        <CommonTable propColumns={columns} propData={paymentList} isVisible={true} />
                    </>}


                    {ispaymentstatus !== 1 && <div className={`mt-4 ${paymentList.length > 0 ? "text-end" : ""}`}>
                        <button type="button" className='btn btn-primary' onClick={() => {
                            setPaymentModal(true)
                            setEdit(false)
                        }}>Add Payment Details</button>
                    </div>}
                </div>
            </div>

            {/*  add/edit paymentdetail modal */}
            <ModalComponent
                show={paymentModal} size={"lg"} onHide={() => {
                    setPaymentModal(false)
                    setPaymentDetail({})
                    setEdit(false)
                }}
                modal_header={<><h4>{isEdit ? "Update Details" : "Add details"}</h4></>}
                modal_body={
                    <>
                        <div className="form_div">
                            <Form onSubmit={formik.handleSubmit} autoComplete="off">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Input_element input_label={`Payment amount(Rs.)`} id="paymentAmount"
                                            type="number" name="paymentAmount" lableClass="font_color"
                                            handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                            value={formik.values.paymentAmount}
                                            placeholder="Enter name"
                                            formikValidation={formik.touched.paymentAmount && formik.errors.paymentAmount ?
                                                <small className='text-danger position-absolute'>{formik.errors.paymentAmount}</small>
                                                : null}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Input_element input_label={`Payment Date`} id="paymentDate"
                                            type="date" name="paymentDate" lableClass="font_color"
                                            handleChange={formik.handleChange} handleBlur={formik.handleBlur}
                                            value={formik.values.paymentDate}
                                            placeholder="Enter name"
                                            formikValidation={formik.touched.paymentDate && formik.errors.paymentDate ?
                                                <small className='text-danger position-absolute'>{formik.errors.paymentDate}</small>
                                                : null}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <div className='position-relative mb-3'>
                                            <div>
                                                <label htmlFor="Description" className='font_color mb-2'>Description</label>
                                            </div>
                                            <textarea rows={3}
                                                name='paymentDescription'
                                                id='paymentDescription'
                                                className='textAreaClass'
                                                placeholder='description...'
                                                value={formik.values.paymentDescription}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                            ></textarea>
                                            <div>{formik.touched.paymentDescription && formik.errors.paymentDescription ?
                                                <small className='text-danger position-absolute'>{formik.errors.paymentDescription}</small>
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
                }
            />

            {/*  delete paymentdetail modal */}
            <ModalComponent
                show={paymentDeleteModal} size={"md"} onHide={() => {
                    setPaymentDeleteModal(false)
                    setPaymentDetail({})
                }}
                modal_body={
                    <>
                        <h5>Do you want to Remove This Payment Detail?</h5>
                        <div className='d-flex justify-content-end gap-3 mt-5'>
                            <button type="button" className='btn btn-primary' onClick={() => {
                                setPaymentDeleteModal(false)
                            }}>Back</button>
                            <button type="button" className='btn btn-danger' onClick={() => handleDeletepayment(paymentDetail)}>Remove</button>
                        </div>
                    </>
                }
            />
        </>
    )
}
