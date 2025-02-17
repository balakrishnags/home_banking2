import React, { useMemo, useEffect, useState } from 'react'
// import { CommonTable } from '../../components/ReactTable/CommonTable'
// import { Images } from '../../utils/images'
// import { configUrl } from '../../apis/api.config'
import { useDispatch, useSelector } from 'react-redux'
// import { PostRequestHook } from '../../apis/Services'
// import { DataForm } from '../../components/DataForm/DataForm'
// import { DataDetails } from '../../components/DataForm/DataDetails'
// import { setSnackbar } from '../../store/reducers/ui.reducer'
import { CommonCreditScreen } from '../Credit/CommonCreditScreen'

export const DebitList = () => {
    // const dispatch = useDispatch()
    // const { getRequest } = PostRequestHook()

    const { userInfo } = useSelector(state => state.UIStore)
    let userId = userInfo?.userId || null

    // const [creditList, setCreditList] = useState([])
    // const [creditDetail, setCreditDetail] = useState({})
    // const [isCreateCredit, setCreateCredit] = useState(false)
    // const [isEditCredit, setEditCredit] = useState(false)
    // const [isDetails, setViewDetails] = useState(false)

    // // snackbar
    // const snackBarContent = (isSuccess, message) => {
    //     dispatch(setSnackbar({ isOpen: true, message: message, isSuccess: isSuccess }))
    // }

    // useEffect(() => {
    //     getCredits()
    // }, [])

    // // get userslist
    // const getCredits = async () => {
    //     let response = await getRequest(`${configUrl.getcreditdebit}debit/${userId}`)
    //     setCreditList(response?.data?.data || [])
    // }

    // user table headers
    // const columns = useMemo(
    //     () => [
    //         {
    //             Header: "Sl. no.",
    //             accessor: (row, index) => index + 1,
    //             Cell: ({ value }) => <span>{value}</span>
    //         },
    //         {
    //             Header: "Debit Date",
    //             accessor: "debitDate"
    //         },
    //         {
    //             Header: "Description",
    //             accessor: "description",
    //             Cell: (tableProps) => <span className='word_limit'>{tableProps.cell.row.original.description}</span>

    //         },
    //         {
    //             Header: "Debit Amount",
    //             accessor: "debitAmount"
    //         },
    //         {
    //             Header: "View/Edit",
    //             accessor: "action",
    //             Cell: (tableProps) => {
    //                 return (
    //                     <div>
    //                         <div className="d-flex flex-row justify-content-center align-items-center">
    //                             <img
    //                                 src={Images.viewIcon}
    //                                 alt="icon"
    //                                 id={`editInventory${tableProps.cell.row.original.debitId}`}
    //                                 className="editIcon"
    //                                 onClick={() => {
    //                                     let data = {
    //                                         creditId: tableProps.cell.row.original.debitId,
    //                                         creditDate: tableProps.cell.row.original.debitDate,
    //                                         creditAmount: tableProps.cell.row.original.debitAmount,
    //                                         description: tableProps.cell.row.original.description
    //                                     }
    //                                     setCreditDetail(data)
    //                                     setCreateCredit(true)
    //                                     setViewDetails(true)
    //                                 }}
    //                             />
    //                             {/* <img
    //                                 src={Images.deleteLogo}
    //                                 alt="icon"
    //                                 id={`deleteInventory${tableProps.cell.row.original.userId}`}
    //                                 className="editIcon mx-2"
    //                                 onClick={(e) => {
    //                                     // setUserDetail(tableProps.cell.row.original)
    //                                     // setUserDeleteModal(true)
    //                                 }}
    //                             /> */}
    //                         </div>
    //                     </div>
    //                 )
    //             },
    //         },
    //     ], []
    // );

    return (
        <>
            {/* <div className='my-5 mx-md-4 mx-md-5'>
                <div className="d-md-flex justify-content-between">
                    <h3>{isCreateCredit ? (isDetails ? "Debit details" : (isEditCredit ? "Update Debit Details" : "Add New Debit")) : "Debit List"}</h3>
                    <button type="button" className='btn btn-primary' onClick={() => {
                        setCreditDetail({})
                        setCreateCredit(!isCreateCredit)
                        setViewDetails(false)
                        setEditCredit(false)
                    }}>{isCreateCredit ? "Back to List" : "Add new"}</button>
                </div>
                {isCreateCredit ? <>{isDetails ? <>
                    <DataDetails detail={creditDetail} setView={setViewDetails} setEdit={setEditCredit} type={"debit"}
                        snackBarContent={snackBarContent} refreshTable={getCredits} setList={setCreateCredit} />
                </> :
                    <DataForm formData={creditDetail} type={"debit"} snackBarContent={snackBarContent} refreshtable={getCredits}
                        setCreateData={setCreateCredit} isUpdate={isEditCredit} />}
                </> :
                    <CommonTable propColumns={columns} propData={creditList} />}
            </div> */}
            <CommonCreditScreen userDetail={{ userId }} setUserView={() => { }} type={"debit"}
                isAdmin={false} />
        </>
    )
}
