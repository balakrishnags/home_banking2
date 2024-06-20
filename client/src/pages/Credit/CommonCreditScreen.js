import React, { useMemo, useEffect, useState } from 'react'
import { CommonTable } from '../../components/ReactTable/CommonTable'
import { Images } from '../../utils/images'
import { configUrl } from '../../apis/api.config'
import { useDispatch, useSelector } from 'react-redux'
import { PostRequestHook } from '../../apis/Services'
import { DataForm } from '../../components/DataForm/DataForm'
import { DataDetails } from '../../components/DataForm/DataDetails'
import { setBalance, setSnackbar } from '../../store/reducers/ui.reducer'
import { PaymentDetails } from '../Lending/PaymentDetails'

export const CommonCreditScreen = (props) => {
    const { userDetail, setCreateUser, setUserView, type, isAdmin } = props
    const dispatch = useDispatch()
    const { getRequest } = PostRequestHook()

    const [creditList, setCreditList] = useState([])
    const [filterCreditList, setFilterCreditList] = useState([])
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
        getAvailableBalance()
    }, [])

    // get expenditure list
    const getCredits = async () => {
        let response = await getRequest(`${configUrl.getcreditdebit}${type}/${userDetail.userId}`)
        setCreditList(response?.data?.data || [])
        setFilterCreditList(response?.data?.data || [])
        if (Object.keys(creditDetail).length > 0 && (type === "lending" || type === "borrow")) {
            let responsedata = response?.data?.data || []
            let data = {};
            if (type === "lending") {
                let _data = responsedata.filter(item => item.lendId === creditDetail?.creditId)
                _data = _data?.[0] || {}
                data = {
                    ..._data,
                    creditId: _data.lendId,
                    creditDate: _data.lendingDate,
                    creditAmount: _data.lendingAmount,
                    description: _data.description
                }
            } else if (type === "borrow") {
                let _data = responsedata.filter(item => item.borrowId === creditDetail?.creditId)
                _data = _data?.[0] || {}
                data = {
                    ..._data,
                    creditId: _data.borrowId,
                    creditDate: _data.borrowDate,
                    creditAmount: _data.borrowAmount,
                    description: _data.description
                }
            }
            setCreditDetail(data)
        }
    }

    const getAvailableBalance = async () => {
        if (!isAdmin) {
            var response = await getRequest(`${configUrl.getAvailableBalance}${userDetail.userId}`)
            dispatch(setBalance(response?.data?.data || {}))
        }
    }

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
                accessor: "description",
                Cell: (tableProps) => <span className='word_limit'>{tableProps.cell.row.original.description}</span>
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

    const _columns = useMemo(
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
                accessor: "description",
                Cell: (tableProps) => <span className='word_limit'>{tableProps.cell.row.original.description}</span>
            },
            {
                Header: <span className='text-capitalize'>{type} Amount</span>,
                accessor: `${type}Amount`
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
                                    id={`editInventory${tableProps.cell.row.original.creditId}`}
                                    className="editIcon"
                                    onClick={() => {
                                        let data = {};
                                        if (type === "lending") {
                                            data = {
                                                ...tableProps.cell.row.original,
                                                creditId: tableProps.cell.row.original.lendId,
                                                creditDate: tableProps.cell.row.original.lendingDate,
                                                creditAmount: tableProps.cell.row.original.lendingAmount,
                                                description: tableProps.cell.row.original.description
                                            }
                                        } else if (type === "borrow") {
                                            data = {
                                                ...tableProps.cell.row.original,
                                                creditId: tableProps.cell.row.original.borrowId,
                                                creditDate: tableProps.cell.row.original.borrowDate,
                                                creditAmount: tableProps.cell.row.original.borrowAmount,
                                                description: tableProps.cell.row.original.description
                                            }
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

    const [selectedFilter, setSelectedFilter] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterDate, setFilterDate] = useState({ start: '', end: '' });

    const handleFilterValues = (e) => {
        setFilterValue(e)
        if (e) {
            let data = creditList.filter(item =>
                selectedFilter === 'amount' ?
                    (type === "credit" ? item.creditAmount.toString().includes(e) : (type === "debit" ? item.debitAmount.toString().includes(e)
                        : (type === "borrow" ? item.borrowAmount.toString().includes(e) : item.lendingAmount.toString().includes(e))))
                    : item.description.toLowerCase().includes(e.toLowerCase())
            )
            setFilterCreditList(data)
        } else {
            setFilterCreditList(creditList)
        }
    }

    const handleFilterDate = (date, dateType) => {
        if (dateType == 'start') {
            setFilterDate({ ...filterDate, start: date })
        } else {
            setFilterDate({ ...filterDate, end: date })
        }
    }

    useEffect(() => {
        if (selectedFilter === 'date') {
            const filteredData = filterDataByDate(creditList, filterDate.start, filterDate.end, type)
            setFilterCreditList(filteredData)
        }
    }, [filterDate])

    const filterDataByDate = (data, fromDate, toDate, datetype) => {
        return data.filter(item => {
            const date = new Date(item[`${datetype}Date`]);

            if (fromDate && toDate) {
                return date >= new Date(fromDate) && date <= new Date(toDate);
            } else if (fromDate) {
                return date >= new Date(fromDate);
            } else if (toDate) {
                return date <= new Date(toDate);
            }

            return true;
        });
    }

    return (
        <>
            <div className='my-5 mx-md-4 mx-md-5'>
                {isAdmin && !isCreateCredit && <div className='d-flex mb-4 align-items-end'>
                    <img src={Images.backarrow} alt="icon" className='backIcon me-1' onClick={() => {
                        setCreateUser(false)
                        setUserView(false)
                        setCreateCredit(false)
                        setViewDetails(false)
                        setEditCredit(false)
                    }} />
                    <h6 className='mb-0 lh-1'>Back to User list</h6>
                </div>}
                <div className="d-md-flex justify-content-between">
                    {!isAdmin ? <>
                        <h3 className='text-capitalize'>{isCreateCredit ? (isDetails ? `${type} details` : (isEditCredit ? `Update ${type} Details` : `Add New ${type}`)) : `${type} List`}</h3></>
                        : <h5><span className='text-capitalize'> {`${isCreateCredit ? (isDetails ? `${type} Details` : (isEditCredit ? `Update ${type} Details` : "Add New Details")) : `${type} List`} - ${userDetail.userName}`}</span></h5>}
                    <button type="button" className='btn btn-primary' onClick={() => {
                        setCreditDetail({})
                        setCreateCredit(!isCreateCredit)
                        setViewDetails(false)
                        setEditCredit(false)
                    }}>{isCreateCredit ? "Back to List" : "Add new"}</button>
                </div>
                {isCreateCredit ?
                    <>
                        {isDetails ? <>
                            <DataDetails detail={creditDetail} setView={setViewDetails} setEdit={setEditCredit} type={type}
                                snackBarContent={snackBarContent} refreshTable={getCredits} setList={setCreateCredit} />
                            {(type == "lending" || type == "borrow") &&
                                <PaymentDetails detail={creditDetail} snackBarContent={snackBarContent} refreshTable={getCredits} paymentType={type} />
                            }
                        </> :
                            <DataForm formData={creditDetail} type={type} snackBarContent={snackBarContent} refreshtable={getCredits}
                                setCreateData={setCreateCredit} isUpdate={isEditCredit} userId={userDetail.userId} />}
                    </> :
                    <>
                        <div className="mt-4 mb-2">
                            {selectedFilter !== 'date' && <p className="mb-2">
                                Filter By
                            </p>}
                            <div className='row'>
                                <div className="col-md-3">
                                    <div>
                                        {selectedFilter === 'date' && <p className="mb-2">
                                            Filter By
                                        </p>}
                                        <select name="filter" id="filter" className='form-select'
                                            value={selectedFilter}
                                            onChange={(e) => {
                                                setSelectedFilter(e.target.value)
                                                setFilterValue('')
                                                handleFilterValues('')
                                                setFilterDate({ start: '', end: '' })
                                            }}>
                                            <option value="" selected>Select</option>
                                            <option value="amount" >Amount</option>
                                            <option value="description">Description</option>
                                            <option value="date" className='text-capitalize'>{type} Date</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    {selectedFilter === 'amount' ? <>
                                        <input type="number" value={filterValue} className='form-control'
                                            placeholder='Enter Amount' onChange={(e) => handleFilterValues(e.target.value)} />
                                    </> : selectedFilter === "description" ? <>
                                        <input type="text" value={filterValue} className='form-control'
                                            placeholder='Enter text' onChange={(e) => handleFilterValues(e.target.value)} />
                                    </> :
                                        <>{selectedFilter === "date" && <>
                                            <div className='row'>
                                                <div className='col-6'>
                                                    <label className='mb-2'>From Date</label>
                                                    <input type="date" className='form-control' max={filterDate.end}
                                                        value={filterDate.start} onChange={(e) => handleFilterDate(e.target.value, 'start')} />
                                                </div>
                                                <div className='col-6'>
                                                    <label className="mb-2">To Date</label>
                                                    <input type="date" className='form-control' min={filterDate.start}
                                                        value={filterDate.end} onChange={(e) => handleFilterDate(e.target.value, 'end')} />
                                                </div>
                                            </div>
                                            {/* <input type="date" className='form-control'
                                            placeholder='Enter text' onChange={(e) => handleFilterValues(e.target.value)} /> */}
                                        </>}
                                        </>}
                                </div>
                            </div>
                        </div>
                        <CommonTable propColumns={(type == "lending" || type == "borrow") ? _columns : columns} propData={filterCreditList} />
                    </>}
            </div>
        </>
    )
}
