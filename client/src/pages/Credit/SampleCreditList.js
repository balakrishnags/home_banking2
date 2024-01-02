import React, { useMemo, useEffect, useState } from 'react'
import { CommonTable } from '../../components/ReactTable/CommonTable'
import { Images } from '../../utils/images'
import { configUrl } from '../../apis/api.config'
import { PostRequestHook } from '../../apis/Services'
import { DataDetails } from '../../components/DataForm/DataDetails'

export const SampleCreditList = (props) => {
    const { userDetail, setUserView, type } = props
    const { getRequest } = PostRequestHook()


    const [creditList, setCreditList] = useState([])
    const [creditDetail, setCreditDetail] = useState({})
    const [isCreateCredit, setCreateCredit] = useState(false)
    const [isEditCredit, setEditCredit] = useState(false)
    const [isDetails, setViewDetails] = useState(false)

    // snackbar
    const snackBarContent = (isSuccess, message) => {

    }

    useEffect(() => {
        getCredits()
    }, [])

    // get userslist
    const getCredits = async () => {
        let response = await getRequest(`${configUrl.getcreditdebit}${type}/${userDetail.userId}`)
        setCreditList(response?.data?.data || [])
    }

    // user table headers
    const columns = useMemo(
        () => [
            {
                Header: "Sl. no.",
                accessor: (row, index) => index + 1,
                Cell: ({ value }) => <span>{value}</span>
            },
            {
                Header: <span className='text-capitalize'>{type} Date</span>,
                accessor: `${type}Date`
            },
            {
                Header: "Description",
                accessor: "description"
            },
            {
                Header: <span className='text-capitalize'>{type} Amount</span>,
                accessor: `${type}Amount`
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
                                    id={`editInventory${tableProps.cell.row.original.creditId}`}
                                    className="editIcon"
                                    onClick={() => {
                                        let data = {};
                                        if (type === "credit") {
                                            data = tableProps.cell.row.original
                                        } else if (type === "debit") {
                                            data = {
                                                creditId: tableProps.cell.row.original.debitId,
                                                creditDate: tableProps.cell.row.original.debitDate,
                                                creditAmount: tableProps.cell.row.original.debitAmount,
                                                description: tableProps.cell.row.original.description
                                            }
                                        } else if (type === "lending") {
                                            data = {
                                                ...tableProps.cell.row.original,
                                                creditId: tableProps.cell.row.original.lendId,
                                                creditDate: tableProps.cell.row.original.lendingDate,
                                                creditAmount: tableProps.cell.row.original.lendingAmount,
                                                description: tableProps.cell.row.original.description
                                            }
                                        }
                                        setCreditDetail(data)
                                        setCreateCredit(true)
                                        // setUserView(true)
                                    }}
                                />
                                {/* <img
                                    src={Images.deleteLogo}
                                    alt="icon"
                                    id={`deleteInventory${tableProps.cell.row.original.userId}`}
                                    className="editIcon mx-2"
                                    onClick={(e) => {
                                        // setUserDetail(tableProps.cell.row.original)
                                        // setUserDeleteModal(true)
                                    }}
                                /> */}
                            </div>
                        </div>
                    )
                },
            },
        ], []
    );

    return (
        <>
            <div className='my-5'>
                <div className="d-md-flex justify-content-between">
                    <h5><span className='text-capitalize'>{type}</span> {`${isCreateCredit ? "Details" : "List"} - ${userDetail.userName}`}</h5>
                    {isCreateCredit ? <button type="button" className='btn btn-primary' onClick={() => {
                        setCreditDetail({})
                        setCreateCredit(!isCreateCredit)
                        // setViewDetails(false)
                        setEditCredit(false)
                    }}>{isCreateCredit ? "Back to List" : "Back to Detail"}</button> : <>
                        <button type="button" className='btn btn-primary' onClick={() => {
                            setUserView(false)
                        }}>Back to Detail</button>
                    </>}
                </div>
                {isCreateCredit ?
                    <DataDetails detail={creditDetail} setView={setViewDetails} setEdit={setEditCredit} type={type}
                        snackBarContent={snackBarContent} refreshTable={getCredits} setList={setCreateCredit} isUserView={true} />
                    : <>
                        {creditList.length > 0 ? <CommonTable propColumns={columns} propData={creditList} />
                            : <>
                                <h5 className='my-5'>No Data Found</h5>
                            </>}</>}
            </div>
        </>
    )
}
