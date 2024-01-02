import React, { useState, useEffect, useMemo } from 'react'
import { CommonTable } from '../../components/ReactTable/CommonTable'
import { Images } from '../../utils/images'
import { configUrl } from '../../apis/api.config'
import { PostRequestHook } from '../../apis/Services'
import { UserDetails } from './UserDetails'
import { useDispatch } from 'react-redux'
import { setSnackbar } from '../../store/reducers/ui.reducer'

export const UserPassword = () => {
    const dispatch = useDispatch()

    const { getRequest } = PostRequestHook()
    const [userList, setuserList] = useState([])
    const [userDetail, setuserDetail] = useState({})
    const [isChange, setChange] = useState(false)

    const snackBarContent = (isSuccess, message) => {
        dispatch(setSnackbar({ isOpen: true, message: message, isSuccess: isSuccess }))
    }

    useEffect(() => {
        getPasswordReqs()
    }, [])

    // // get userslist
    const getPasswordReqs = async () => {
        let response = await getRequest(configUrl.getPasswordReq)
        setuserList(response?.data?.data || [])
        // setuserList((previousData) => [...previousData, ...(response?.data?.data || [])])
    }

    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8081/sse/admin`);
        let list = []
        // Event listener for incoming messages
        eventSource.onmessage = (event) => {
            getPasswordReqs()
        };

        // Handle connection closure
        eventSource.onerror = (error) => {
            console.error('Error with SSE connection:', error);
            eventSource.close();
        };

        return () => {
            // Close the connection when the component unmounts
            eventSource.close();
        };
    }, []);



    //  table headers
    const columns = useMemo(
        () => [
            {
                Header: "SL No.",
                accessor: (row, index) => index + 1,
                Cell: ({ value }) => <span>{value}</span>,
            },
            {
                Header: "Name",
                accessor: "userName"
            },
            {
                Header: "Email",
                accessor: "email"
            },

            {
                Header: "Change Password",
                accessor: "action",
                Cell: (tableProps) => {
                    return (
                        <div>
                            <div className="d-flex flex-row justify-content-center align-items-center">
                                <img
                                    src={Images.editLogo}
                                    alt="icon"
                                    id={`editInventory${tableProps.cell.row.original.userId}`}
                                    className="editIcon"
                                    onClick={() => {
                                        setChange(true)
                                        setuserDetail(tableProps.cell.row.original)
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
            <div className='my-5 mx-md-4 mx-lg-5'>
                <div className="d-md-flex justify-content-between">
                    <h4 className="mb-4">Forget/Change Password Requests</h4>
                    {isChange && <button type="button" className='btn btn-success' onClick={() => {
                        setChange(false)
                        setuserDetail({})
                    }}>Back to list</button>}
                </div>
                {isChange ? <>
                    <UserDetails snackBarContent={snackBarContent} userDetail={userDetail} setCreateUser={setChange}
                        refreshtable={getPasswordReqs} isChange={false} />
                </> : <>{userList.length > 0 ?
                    <CommonTable propColumns={columns} propData={userList} />
                    : <>
                        <h5 className='mt-5'>No Requests Found</h5>
                    </>}
                </>}
            </div>
        </>
    )
}
