import React, { useMemo, useEffect, useState } from 'react'
import { CommonTable } from '../../components/ReactTable/CommonTable'
import { Images } from '../../utils/images'
import { configUrl } from '../../apis/api.config'
import { useDispatch, useSelector } from 'react-redux'
import { PostRequestHook } from '../../apis/Services'
import { DataForm } from '../../components/DataForm/DataForm'
import { DataDetails } from '../../components/DataForm/DataDetails'
import { PaymentDetails } from './PaymentDetails'
import { setSnackbar } from '../../store/reducers/ui.reducer'

export const LendingList = () => {
    const { getRequest } = PostRequestHook()
    const dispatch = useDispatch()

    const { userInfo } = useSelector(state => state.UIStore)
    let userId = userInfo?.userId || null

    const [creditList, setCreditList] = useState([])
    const [creditDetail, setCreditDetail] = useState({})
    const [isCreateCredit, setCreateCredit] = useState(false)
    const [isEditCredit, setEditCredit] = useState(false)
    const [isDetails, setViewDetails] = useState(false)

    // snackbar
    const snackBarContent = (isSuccess, message) => {
        dispatch(setSnackbar({ isOpen: true, message: message, isSuccess: isSuccess }))
    }

    useEffect(() => {
        getCredits()
    }, [])

    // get userslist
    const getCredits = async () => {
        let response = await getRequest(`${configUrl.getcreditdebit}lending/${userId}`)
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
                Header: "lending Date",
                accessor: "lendingDate"
            },
            {
                Header: "Description",
                accessor: "description",
                Cell: (tableProps) => <span className='word_limit'>{tableProps.cell.row.original.description}</span>

            },
            {
                Header: "Lending Amount",
                accessor: "lendingAmount"
            },
            {
                Header: "Paid Amount",
                accessor: "totalPaymentAmount"
            },
            {
                Header: "Pending Amount",
                accessor: "pendingAmount"
            },
            {
                Header: "Payment Status",
                accessor: "paymentStatus",
                Cell: (tableProps) => {
                    return (<>
                        <div>{tableProps.cell.row.original.paymentStatus === 0 ? "Payment Pending" : (tableProps.cell.row.original.paymentStatus === 1 ? "Paid" : "Partial Payment")}</div>
                    </>)
                }
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
                                    id={`editInventory${tableProps.cell.row.original.lendId}`}
                                    className="editIcon"
                                    onClick={() => {
                                        let data = {
                                            ...tableProps.cell.row.original,
                                            creditId: tableProps.cell.row.original.lendId,
                                            creditDate: tableProps.cell.row.original.lendingDate,
                                            creditAmount: tableProps.cell.row.original.lendingAmount,
                                            description: tableProps.cell.row.original.description
                                        }
                                        setCreditDetail(data)
                                        setCreateCredit(true)
                                        setViewDetails(true)
                                    }}
                                />
                            </div>
                        </div>
                    )
                },
            },
        ], []
    );

    return (
        <>
            <div className='my-5 mx-md-4 mx-md-5'>
                <div className="d-md-flex justify-content-between">
                    <h3>{isCreateCredit ? (isDetails ? "Lending details" : (isEditCredit ? "Update Lending Details" : "Add New Lending Data")) : "Lending List"}</h3>
                    <button type="button" className='btn btn-primary' onClick={() => {
                        setCreditDetail({})
                        setCreateCredit(!isCreateCredit)
                        setViewDetails(false)
                        setEditCredit(false)
                    }}>{isCreateCredit ? "Back to List" : "Add new"}</button>
                </div>
                {isCreateCredit ? <>{isDetails ? <>
                    <DataDetails detail={creditDetail} setView={setViewDetails} setEdit={setEditCredit} type={"lending"}
                        snackBarContent={snackBarContent} refreshTable={getCredits} setList={setCreateCredit} />
                    <PaymentDetails detail={creditDetail} snackBarContent={snackBarContent} refreshTable={getCredits} paymentType={"lending"} />
                </> :
                    <DataForm formData={creditDetail} type={"lending"} snackBarContent={snackBarContent} refreshtable={getCredits}
                        setCreateData={setCreateCredit} isUpdate={isEditCredit} />}
                </> :
                    <CommonTable propColumns={columns} propData={creditList} />}
            </div>
        </>
    )
}
