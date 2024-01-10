import React, { useMemo, useEffect, useState } from 'react'
import { CommonTable } from '../../components/ReactTable/CommonTable'
import { Images } from '../../utils/images'
import { configUrl } from '../../apis/api.config'
import { useDispatch, useSelector } from 'react-redux'
import { PostRequestHook } from '../../apis/Services'
import { DataForm } from '../../components/DataForm/DataForm'
import { DataDetails } from '../../components/DataForm/DataDetails'
// import { PaymentDetails } from './PaymentDetails'
import { setSnackbar } from '../../store/reducers/ui.reducer'
import { PaymentDetails } from '../Lending/PaymentDetails'
import { CommonCreditScreen } from '../Credit/CommonCreditScreen'

export const Borrow = () => {
    const { getRequest } = PostRequestHook()
    const dispatch = useDispatch()

    const { userInfo } = useSelector(state => state.UIStore)
    let userId = userInfo?.userId || null

    const [creditList, setCreditList] = useState([])
    const [creditDetail, setCreditDetail] = useState({})
    // console.log("🚀 ~ file: Borrow.js:22 ~ Borrow ~ creditDetail:", creditDetail)
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
        let response = await getRequest(`${configUrl.getcreditdebit}borrow/${userId}`)
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
                Header: "Borrowed Date",
                accessor: "borrowDate"
            },
            {
                Header: "Description",
                accessor: "description",
                Cell: (tableProps) => <span className='word_limit'>{tableProps.cell.row.original.description}</span>

            },
            {
                Header: "Borrowed Amount",
                accessor: "borrowAmount"
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
                                    id={`editInventory${tableProps.cell.row.original.borrowId}`}
                                    className="editIcon"
                                    onClick={() => {
                                        let data = {
                                            ...tableProps.cell.row.original,
                                            creditId: tableProps.cell.row.original.borrowId,
                                            creditDate: tableProps.cell.row.original.borrowDate,
                                            creditAmount: tableProps.cell.row.original.borrowAmount,
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
            {/* <div className='my-5 mx-md-4 mx-md-5'>
                <div className="d-md-flex justify-content-between">
                    <h3>{isCreateCredit ? (isDetails ? "Borrow details" : (isEditCredit ? "Update Borrow Details" : "Add New Borrow Data")) : "Borrow List"}</h3>
                    <button type="button" className='btn btn-primary' onClick={() => {
                        setCreditDetail({})
                        setCreateCredit(!isCreateCredit)
                        setViewDetails(false)
                        setEditCredit(false)
                    }}>{isCreateCredit ? "Back to List" : "Add new"}</button>
                </div>
                {isCreateCredit ? <>{isDetails ? <>
                    <DataDetails detail={creditDetail} setView={setViewDetails} setEdit={setEditCredit} type={"borrow"}
                        snackBarContent={snackBarContent} refreshTable={getCredits} setList={setCreateCredit} />
                    <PaymentDetails detail={creditDetail} snackBarContent={snackBarContent} refreshTable={getCredits} paymentType={"borrow"} />
                </> :
                    <DataForm formData={creditDetail} type={"borrow"} snackBarContent={snackBarContent} refreshtable={getCredits}
                        setCreateData={setCreateCredit} isUpdate={isEditCredit} />}
                </> :
                    <CommonTable propColumns={columns} propData={creditList} />}
            </div> */}
            <CommonCreditScreen userDetail={{ userId }} setUserView={() => { }} type={"borrow"}
                isAdmin={false} />
        </>
    )
}
