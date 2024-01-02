import React, { useState, useMemo } from 'react'
import { CommonTable } from '../../components/ReactTable/CommonTable'
import { useEffect } from 'react';
import { PostRequestHook } from '../../apis/Services';
import { configUrl } from '../../apis/api.config';
import { Images } from '../../utils/images';
import { CreateUser } from './CreateUser';
import { useDispatch, useSelector } from 'react-redux';
import { UserDetails } from './UserDetails';
import { setSnackbar } from '../../store/reducers/ui.reducer';

export const Users = () => {
    const { getRequest } = PostRequestHook()
    const dispatch = useDispatch()

    const { userInfo } = useSelector(state => state.UIStore)
    let userId = userInfo?.userId || null

    const [userList, setuserList] = useState([])
    const [userDetail, setUserDetail] = useState({})
    const [isCreateUser, setCreateUser] = useState(false)
    const [isEditUser, setEditUser] = useState(false)
    const [isDetails, setViewDetails] = useState(false)
    const [isUserView, setUserView] = useState(false)

    const snackBarContent = (isSuccess, message) => {
        dispatch(setSnackbar({ isOpen: true, message: message, isSuccess: isSuccess }))
    }

    useEffect(() => {
        getUsers()
    }, [])

    // get userslist
    const getUsers = async () => {
        let response = await getRequest(configUrl.getUsers)
        setuserList(response?.data?.data || [])
    }

    // view userdetails
    const handleUserDetails = (data) => {
        setUserDetail(data)
        setViewDetails(true)
        setCreateUser(true)
    }

    // user table headers
    const columns = useMemo(
        () => [
            {
                Header: "User Name",
                accessor: "userName"
            },
            {
                Header: "Email",
                accessor: "email"
            },
            // {
            //     Header: "Date of Birth",
            //     accessor: "userDob"
            // },
            // {
            //     Header: "Gender",
            //     accessor: "gender"
            // },
            {
                Header: "Role",
                accessor: "userRole",
                Cell: (tableProps) => {
                    return (<>
                        <div>{tableProps.cell.row.original.userRole === 1 ? "Admin" : "User"}</div></>)
                }
            },
            {
                Header: "Phone Number",
                accessor: "userPhoneNumber"
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
                                    id={`editInventory${tableProps.cell.row.original.userId}`}
                                    className="editIcon"
                                    onClick={() => handleUserDetails(tableProps.cell.row.original)}
                                />
                                {/* <img
                                    src={Images.deleteLogo}
                                    alt="icon"
                                    id={`deleteInventory${tableProps.cell.row.original.userId}`}
                                    className="editIcon mx-2"
                                    onClick={(e) => {
                                        setUserDetail(tableProps.cell.row.original)
                                        setUserDeleteModal(true)
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
            <div className='my-5  mx-md-4 mx-lg-5'>
                {!isUserView && <div className="d-flex justify-content-between">
                    <h3>{isCreateUser ? (isDetails ? `User Details` : "Update User") : "Users List"}</h3>
                    <button type="button" className='btn btn-primary' onClick={() => {
                        setCreateUser(!isCreateUser)
                        setUserDetail({})
                        setEditUser(false)
                        setViewDetails(false)
                    }}>{isCreateUser ? "User list" : "Add New User"}</button>
                </div>}
                {isCreateUser ? <>
                    {isDetails ?
                        <UserDetails snackBarContent={snackBarContent} userDetail={userDetail} setCreateUser={setCreateUser}
                            isChange={true} setViewDetails={setViewDetails} refreshtable={getUsers} userId={userId} setEditUser={setEditUser}
                            setUserView={setUserView} isUserView={isUserView} /> :
                        <CreateUser data={userDetail} snackBarContent={snackBarContent} isEditUser={isEditUser}
                            setCreateUser={setCreateUser} refreshtable={getUsers} />}
                </> : <>
                    <CommonTable propColumns={columns} propData={userList} />
                </>}
            </div>
        </>
    )
}
