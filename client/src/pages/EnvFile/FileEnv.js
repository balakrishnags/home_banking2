import { useFormik } from 'formik'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSnackbar } from '../../store/reducers/ui.reducer'
import { configUrl } from '../../apis/api.config'
import { PostRequestHook } from '../../apis/Services'
import { Button, Form } from 'react-bootstrap'
import { Input_element } from '../../components/input_field/Input_element'
import { Selectelement } from '../../components/Select_field/Selectelement'
import { useState } from 'react'
import { useEffect } from 'react'
import { CommonTable } from '../../components/ReactTable/CommonTable'
import { useMemo } from 'react'
import { Images } from '../../utils/images'
import { ModalComponent } from '../../components/modal/ModalComponent'
import { useRef } from 'react'

export const FileEnv = () => {
    const { postRequest, getRequest, deleteRequest, putRequest } = PostRequestHook()
    const dispatch = useDispatch()
    const { envData } = useSelector(state => state.UIStore)
    // console.log("🚀 ~ file: FileEnv.js:22 ~ FileEnv ~ envData:", envData)
    const envNameRef = useRef(null)
    const envNameListRef = useRef(null)

    const [type, setType] = useState("dev")
    const [envdata, setEnvdata] = useState([])
    const [envList, setEnvList] = useState([])
    const [envName, setEnvName] = useState("")
    const [envDelete, setEnvDelete] = useState(false)
    const [isEditEnvName, setEditEnvName] = useState(false)

    useEffect(() => {
        getEnvList()
    }, [])
    useEffect(() => {
        getEnvData(type)
    }, [type])

    useEffect(() => {
        if (isEditEnvName) {
            formik.setValues({ name: envName })
        } else {
            formik.setValues({ name: '' })
        }
    }, [isEditEnvName, envName])

    const getEnvList = async (env) => {
        let response = await getRequest(configUrl.getEnvlist)
        setEnvList(response?.data?.data || [])
    }
    const getEnvData = async (env) => {
        let response = await getRequest(`${configUrl.getEnvData}${env}`)
        setEnvdata(response?.data?.data || [])
    }

    const formik = useFormik({
        initialValues: {
            name: "",
        },
        validate: (values) => {
            let errors = {};

            if (!values.name) {
                errors.name = "Required";
            }

            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            // console.log("🚀 ~ file: FileEnv.js:30 ~ onSubmit: ~ values:", values)
            addEnvironmentList(values, resetForm)
        },
    });

    const addformik = useFormik({
        initialValues: {
            type: "",
            keyName: "",
            accessKey: "",
        },
        validate: (values) => {
            let errors = {};

            if (!values.type) {
                errors.type = "Required";
            }
            if (!values.keyName) {
                errors.keyName = "Required";
            }
            if (!values.accessKey) {
                errors.accessKey = "Required";
            }

            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            // console.log("🚀 ~ file: FileEnv.js:30 ~ onSubmit: ~ values:", values)
            let _keyName = btoa(values.keyName)
            let _accessKey = btoa(values.accessKey)
            let value2 = {
                ...values, keyName: _keyName, accessKey: _accessKey
            }
            addEnvvironmentData(value2, resetForm)
        },
    });

    // get environment data
    const addEnvvironmentData = async (data, resetForm) => {
        var response = await postRequest(configUrl.addEnvData, data)
        if (response.status == 201 || response.status == 200) {
            // setIsSent(true)
            dispatch(setSnackbar({ isOpen: true, message: response.data.message, isSuccess: true }))
            setType(data.type)
            getEnvData(data.type)
            resetForm()
        } else {
            dispatch(setSnackbar({ isOpen: true, message: response?.response?.data?.message || "Error", isSuccess: false }))
        }
    }

    //get environment list
    const addEnvironmentList = async (data, resetForm) => {
        var response = isEditEnvName ? await putRequest(`${configUrl.updateEnvList}${envName}`, data) : await postRequest(configUrl.addEnvList, data)
        if (response.status == 201 || response.status == 200) {
            dispatch(setSnackbar({ isOpen: true, message: response.data.message, isSuccess: true }))
            resetForm()
            getEnvList()
            setEditEnvName(false)
            envNameListRef.current.scrollIntoView({ behaviour: "smooth", block: "center" })
        } else {
            dispatch(setSnackbar({ isOpen: true, message: response?.response?.data?.message || "Error", isSuccess: false }))
        }
    }
    // delete environment name
    const deleteEnvironment = async (envName) => {
        var response = await deleteRequest(`${configUrl.deleteEnvList}${envName}`)
        if (response.status == 200) {
            dispatch(setSnackbar({ isOpen: true, message: response.data.message, isSuccess: true }))
            getEnvList()
            setEnvDelete(false)
        } else {
            dispatch(setSnackbar({ isOpen: true, message: response?.response?.data?.message || "Error", isSuccess: false }))
        }
    }

    const isBase64Encoded = (data) => {
        try {
            return btoa(atob(data)) === data;
        } catch (e) {
            return false;
        }
    }

    // user table headers
    const columns = useMemo(
        () => [
            {
                Header: "Key",
                accessor: "keyName",
                Cell: (tableProps) => {
                    return (<>
                        {isBase64Encoded(tableProps.cell.row.original.keyName) ? atob(tableProps.cell.row.original.keyName) : tableProps.cell.row.original.keyName}
                    </>)
                }
            },
            {
                Header: "value",
                accessor: "accessKey",
                Cell: (tableProps) => {
                    return (<>
                        {isBase64Encoded(tableProps.cell.row.original.accessKey) ? atob(tableProps.cell.row.original.accessKey) : tableProps.cell.row.original.accessKey}
                    </>)
                }
            },
        ], []
    );

    const nameColumns = useMemo(
        () => [
            {
                Header: "Sl no.",
                accessor: (row, index) => index + 1,
                Cell: ({ value }) => <span>{value}</span>
            },
            {
                Header: "Environment",
                accessor: "type"
            },
            {
                Header: "Edit/Delete",
                accessor: "action",
                Cell: (tableProps) => {
                    return (
                        <div>
                            <div className="d-flex flex-row justify-content-center align-items-center">
                                <img
                                    src={Images.editLogo}
                                    alt="icon"
                                    id={`editInventory${tableProps.cell.row.original.type}`}
                                    className="editIcon"
                                    onClick={() => {
                                        setEnvName(tableProps.cell.row.original.type)
                                        setEditEnvName(true)
                                        envNameRef.current.scrollIntoView({ behaviour: "smooth", block: 'center' })
                                        // setCreditDetail(data)
                                        // setCreateCredit(true)
                                        // setViewDetails(true)
                                    }}
                                />
                                <img
                                    src={Images.deleteLogo}
                                    alt="icon"
                                    id={`deleteInventory${tableProps.cell.row.original.type}`}
                                    className="editIcon mx-2"
                                    onClick={(e) => {
                                        setEnvName(tableProps.cell.row.original.type)
                                        setEnvDelete(true)
                                    }}
                                />
                            </div>
                        </div>
                    )
                },
            },
        ], []
    );


    return (<>
        <div className='my-5'>
            <div className="my-4">
                <div className="my-4" ref={envNameListRef}>
                    <h4 className="mb-4">EnvironMent</h4>
                    <CommonTable propColumns={nameColumns} propData={envList} />
                </div>
                <div ref={envNameRef}>
                    <h4>Create Environment</h4>
                    <div className="formsignin_width">
                        <Form onSubmit={formik.handleSubmit}>
                            <Input_element
                                id="name"
                                input_label="Environment Name"
                                type="text"
                                lableClass="font_color"
                                name="name"
                                handleBlur={formik.handleBlur}
                                handleChange={formik.handleChange}
                                value={formik.values.name}
                                placeholder=""
                                formikValidation={formik.touched.name && formik.errors.name ? (
                                    <>
                                        <small className="text-danger small">{formik.errors.name}</small>
                                    </>
                                ) : null}
                            />

                            <Button type="submit" className="btn btn-primary" id="resetbutton">
                                Submit
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="my-4">
                <h4>Add data to Environment</h4>
                <div className="form_div">
                    <Form onSubmit={addformik.handleSubmit}>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Selectelement select_Label="Environment type" lableClass="font_color" name="type" id="envtype2"
                                            handleChange={addformik.handleChange} handleBlur={addformik.handleBlur}
                                            value={addformik.values.type}
                                            optionArray={<>{envList.length > 0 && envList.map((item, i) => {
                                                return <option value={item.type} key={i}>{item.type}</option>
                                            })}
                                            </>}
                                            formikValidation={addformik.touched.type && addformik.errors.type ?
                                                <small className='text-danger position-absolute'>{addformik.errors.type}</small>
                                                : null}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className="col-md-6">
                                <Input_element
                                    id="type"
                                    input_label="Key"
                                    type="text"
                                    lableClass="font_color"
                                    name="keyName"
                                    handleBlur={addformik.handleBlur}
                                    handleChange={addformik.handleChange}
                                    value={addformik.values.keyName}
                                    placeholder=""
                                    formikValidation={addformik.touched.keyName && addformik.errors.keyName ? (
                                        <>
                                            <small className="text-danger small">{addformik.errors.keyName}</small>
                                        </>
                                    ) : null}
                                />
                            </div>
                            <div className="col-md-6">
                                <Input_element
                                    id="accessKey"
                                    input_label="Value"
                                    type="text"
                                    lableClass="font_color"
                                    name="accessKey"
                                    handleBlur={addformik.handleBlur}
                                    handleChange={addformik.handleChange}
                                    value={addformik.values.accessKey}
                                    placeholder=""
                                    formikValidation={addformik.touched.accessKey && addformik.errors.accessKey ? (
                                        <>
                                            <small className="text-danger small">{addformik.errors.accessKey}</small>
                                        </>
                                    ) : null}
                                />
                            </div>
                            {/* <div className="col-md-6">
                                <Input_element
                                    id="secretKey"
                                    input_label="Secret Key"
                                    type="text"
                                    lableClass="font_color"
                                    name="secretKey"
                                    handleBlur={addformik.handleBlur}
                                    handleChange={addformik.handleChange}
                                    value={addformik.values.secretKey}
                                    placeholder=""
                                    formikValidation={addformik.touched.secretKey && addformik.errors.secretKey ? (
                                        <>
                                            <small className="text-danger small">{addformik.errors.secretKey}</small>
                                        </>
                                    ) : null}
                                />
                            </div> */}
                        </div>

                        <Button type="submit" className="btn_submit" id="resetbutton">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>

            <div className='my-5 mx-5'>
                <div className="mb-4 d-flex gap-3">
                    <h5 htmlFor="selecttype">Select ENV type : </h5>
                    <select name="selecttype" id="selecttype" value={type} onChange={(e) => setType(e.target.value)}>
                        <>{envList.length > 0 && envList.map((item, i) => {
                            return <option value={item.type} key={i}>{item.type}</option>
                        })}
                        </>
                    </select>
                </div>

                <h4 className='mb-4'>Environment Data - {type}</h4>

                <CommonTable propColumns={columns} propData={envdata} />
            </div>
        </div>

        <ModalComponent show={envDelete} size={"md"} onHide={() => {
            setEnvDelete(false)
            setEnvName("")
        }}
            modal_header={<><h4>Delete Environemt - {envName}</h4></>}
            modal_body={<>
                <h6>All the data related to this Environment will be removed</h6>
                <div className="text-end mt-3">
                    <button type="button" className='btn btn-danger' onClick={() => deleteEnvironment(envName)}>Delete</button>
                </div>
            </>}
        />
    </>
    )
}
