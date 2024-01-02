import React, { useState } from 'react'
import { ModalComponent } from '../modal/ModalComponent'
import { PostRequestHook } from '../../apis/Services'
import { configUrl } from '../../apis/api.config'

export const DataDetails = (props) => {
    const { detail, setEdit, setView, type, snackBarContent, refreshTable, setList, isUserView } = props
    // console.log("🚀 ~ file: DataDetails.js:8 ~ DataDetails ~ detail:", detail)
    const { deleteRequest } = PostRequestHook()

    const [deleteModal, setDeleteModal] = useState(false)

    const handleDeleteUser = async () => {
        let response = await deleteRequest(`${configUrl.deleteCreditDebit}${type}/${detail?.creditId}`)
        if (response.status === 200) {
            snackBarContent(true, response.data.message)
            refreshTable()
            setList(false)
        } else {
            snackBarContent(false, response?.response?.data?.message || "server error")
        }
    }

    return (
        <>
            <div className="my-5 div_border">
                <div className="row">
                    <div className="col-md-6">
                        <p className='mb-2'><span className='text-capitalize'>{type}</span> Amount : <strong>{detail?.creditAmount || ""}</strong></p>
                    </div>
                    <div className="col-md-6">
                        <p className='mb-2'><span className='text-capitalize'>{type}</span> Date : <strong>{detail?.creditDate || ""}</strong></p>
                    </div>
                    <div className="col-md-6">
                        <p className='mb-2'>Description : <strong>{detail?.description || ''}</strong></p>
                    </div>

                    {(type === "lending" || type === "borrow") && <>
                        <div className="col-md-12 mt-4">
                            {/* <h5 className='text-decoration-underline'>Payment Status</h5> */}
                            <div className="row">
                                <div className="col-md-6">
                                    <p className='mb-2'><span className='text-capitalize'>Total Payment</span> Amount : <strong>{detail?.totalPaymentAmount || ""}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className='mb-2'><span className='text-capitalize'>Pending</span> Amount : <strong>{detail?.pendingAmount}</strong></p>
                                </div>
                                <div className="col-md-6">
                                    <p className='mb-2'><span className='text-capitalize'>Payment</span> Status : <strong>{detail?.paymentStatus === 0 ? "Payment Pending" : (detail?.paymentStatus === 1 ? "Paid/Completed" : "Partial Payment")}</strong></p>
                                </div>
                            </div>
                        </div>
                    </>}
                </div>
            </div>


            {!isUserView && <div className="d-md-flex justify-content-end gap-3">
                <button type="button" className='btn btn-danger' onClick={() => {
                    setDeleteModal(true)
                }}>Delete</button>
                <button type="button" className='btn btn-success' onClick={() => {
                    setEdit(true)
                    setView(false)
                }}>Edit Details</button>
            </div>}

            {/*  user delete modal */}
            <ModalComponent
                show={deleteModal} size={"md"} onHide={() => {
                    setDeleteModal(false)
                    // setUserModal(true)
                }}
                modal_header={<><h4>Remove User</h4></>}
                modal_body={
                    <>
                        <h5>Do you want to delete This {type} data ?</h5>
                        <div className='d-flex justify-content-end gap-3 mt-5'>
                            <button type="button" className='btn btn-primary' onClick={() => {
                                setDeleteModal(false)
                                // setUserModal(true)
                            }}>Back</button>
                            <button type="button" className='btn btn-danger' onClick={() => handleDeleteUser(detail?.creditId)}>Remove</button>
                        </div>
                    </>
                }
            />
        </>
    )
}
