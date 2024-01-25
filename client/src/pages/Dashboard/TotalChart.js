import React, { useEffect, useState } from 'react'
import { BarChart } from './BarChart'
import { PostRequestHook } from '../../apis/Services'
import { configUrl } from '../../apis/api.config'
import { useDispatch, useSelector } from 'react-redux'
import './Dashboard.scss'
import { useNavigate } from 'react-router-dom'
import { RouteStrings } from '../../utils/common'
import { customMethods } from '../../utils/Custom'
import { ModalComponent } from '../../components/modal/ModalComponent'
import { PasswordShowHide } from '../../components/PasswordShow/PasswordShowHide'
import { setTime } from '../../store/reducers/ui.reducer'

export const TotalChart = (props) => {
    const { userId, isDashBoard, setUserView, setUserType } = props

    const { getRequest, postRequest } = PostRequestHook()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { balance, totalUsers, isTime, userInfo } = useSelector(state => state.UIStore)

    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });;
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => currentYear - index);

    const [chartData, setChartData] = useState({})
    const [type, setType] = useState("month")
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${currentMonth}`);
    const [userBalnce, setUserBalance] = useState(0)
    const [filterValue, setFilterValue] = useState("month")
    const [isBalanceView, setBalanceView] = useState(false)
    const [isBalanceModal, setBalanceModal] = useState(false)
    const [balanceTime, setBalanceTime] = useState(0)
    const [password, setPassword] = useState('')
    const [isPasswordError, setPasswordError] = useState({ error: false, msg: "" })

    useEffect(() => {
        getChartData(userId, type, `${currentYear}-${currentMonth}`)
        getAvailableBalance(userId)
    }, [])
    useEffect(() => {
        if (balanceTime > 0) {
            const timeoutId = setTimeout(() => {
                dispatch(setTime(null))
                setBalanceView(false)
                setBalanceTime(0)
            }, balanceTime);

            return () => clearTimeout(timeoutId)
        }
    }, [balanceTime])
    useEffect(() => {
        if (isTime) {
            let diffTime = handleCaluculateTime(isTime, 1)
            if (diffTime < 0) {
                setBalanceTime(Math.abs(diffTime))
                setBalanceView(true)
            } else {
                dispatch(setTime(null))
                setBalanceView(false)
            }
        }
    }, [isTime])
    // verify time
    const handleCaluculateTime = (time, timelimit) => {
        let _time = new Date(time)
        _time.setMinutes(_time.getMinutes() + timelimit)
        let differenceTime = new Date() - _time
        return differenceTime
    }


    const getChartData = async (user, type, date) => {
        let response = await getRequest(`${configUrl.getChartData}${user}/${type}/${date}`)
        setChartData(response?.data?.data || {})
    }

    const getAvailableBalance = async (Id) => {
        var response = await getRequest(`${configUrl.getAvailableBalance}${Id}`)
        setUserBalance(response?.data?.data?.available_balance)
    }

    // State to hold the selected year
    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value)
        setSelectedYear('')
        setType("month")
        getChartData(userId, "month", e.target.value)
    }
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value)
        setSelectedMonth('')
        setType("year")
        getChartData(userId, "year", e.target.value)
    }
    const handleAllChange = (e) => {
        let eventvalue = e.target.value
        setFilterValue(eventvalue)
        if (eventvalue === "all") {
            setType("allyear")
            getChartData(userId, "allyear", currentYear)
        } else if (eventvalue === 'month') {
            setSelectedMonth(`${currentYear}-${currentMonth}`)
            setSelectedYear('')
            setType("month")
            getChartData(userId, "month", `${currentYear}-${currentMonth}`)
        } else {
            setSelectedYear(currentYear)
            setSelectedMonth('')
            setType("year")
            getChartData(userId, "year", currentYear)
        }
    }


    const handleVerifyPassword = () => {
        if (password.length > 7) {
            let data = {
                email: userInfo.email,
                password: password,
                isAdmin: userInfo.role === 1 ? true : false
            }
            postSigninUpdate(data)
        } else {
            setPasswordError({ error: true, msg: "Enter valid password" })
        }
    }
    // verify password
    const postSigninUpdate = async (data) => {
        var response = await postRequest(configUrl.login, data)
        if (response?.status === 200) {
            dispatch(setTime(new Date()))
            setBalanceModal(false)
            setPassword('')
        } else if (response?.response?.data?.status === 401 || response?.response?.data?.status === 404) {
            setPasswordError({ error: true, msg: response?.response?.data?.message })
        }
    }

    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    return (
        <>
            <div className='my-5'>
                {isDashBoard && <>
                    <div className='text-end mb-4'>
                        {!isBalanceView ? <h5 className='text-decoration-underline' onClick={() => { setBalanceModal(true) }}><span className='cursor-pointer'>View Account balance</span> </h5> :
                            <h5 className='text-decoration-underline'>Your Account Balance - &#8377; {customMethods.numberFormat(balance) || 0}</h5>
                        }
                    </div>
                    <div className='userBox my-5' onClick={() => navigate(RouteStrings.users)}>
                        <h5 className='mb-4'>Total Active Users</h5>
                        <h5 className='text-end m-0'>{totalUsers || 0}</h5>
                    </div>
                </>}

                {!isDashBoard && <div className='mb-4'>
                    <h6 className='text-decoration-underline'>Account Balance -- &#8377; {customMethods.numberFormat(userBalnce) || 0}</h6>
                </div>}
                <div className="d-flex justify-content-end gap-4">
                    {filterValue === "year" && <div>
                        <div className='mb-2'>
                            <label htmlFor="datemonth"><strong>Search by Year</strong></label>
                        </div>
                        <select id="yearDropdown" className='drpheight' value={selectedYear} onChange={handleYearChange}>
                            <option value="" disabled>Select a year</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>}
                    {filterValue === 'month' && <div>
                        <div className='mb-2'>
                            <label htmlFor="datemonth"><strong>Search by Month</strong></label>
                        </div>
                        <input type="month" name="datemonth" id="datemonth" className='drpheight' value={selectedMonth} onChange={(e) => handleMonthChange(e)} />
                    </div>}
                    <div>
                        <div className='mb-2'>
                            <label htmlFor="datemonth"><strong>Filter By</strong></label>
                        </div>
                        <select id="filterDropdown" className='drpheight' value={filterValue} onChange={(e) => handleAllChange(e)}>
                            <option value="month">Month</option>
                            <option value="year">Year</option>
                            <option value="all">All year</option>
                        </select>
                    </div>
                </div>
                <div className="my-5">
                    {type === "allyear" ? <h4 className='mb-3 text-decoration-underline'>Total Expenditure</h4> :
                        <h4 className='mb-3 text-decoration-underline'>Expenditure of {type} - {type === "month" && `${monthList[new Date(selectedMonth).getMonth()]}, `}{type === "month" ? new Date(selectedMonth).getFullYear() : selectedYear}</h4>}
                    <p className='mb-2'>Total Credit Amount -- <strong>{chartData?.totalCredit}</strong></p>
                    <p>Total Debit Amount -- <strong>{chartData?.totalDebit}</strong></p>
                </div>
                <div className='my-5'>
                    <h5 className='mb-4 cursor-pointer text-decoration-underline' onClick={isDashBoard ? () => navigate(RouteStrings.creditlist) : () => {
                        setUserView(true)
                        setUserType("credit")
                    }}>Credit - &#8377; {chartData?.totalCredit || 0}</h5>
                    <BarChart type={type} data={chartData?.creditData || []} date={selectedMonth} />
                </div>
                <div className='my-5'>
                    <h4 className='mb-4 cursor-pointer text-decoration-underline' onClick={isDashBoard ? () => navigate(RouteStrings.debitlist) : () => {
                        setUserView(true)
                        setUserType('debit')
                    }}>Debit - &#8377; {chartData?.totalDebit || 0}</h4>
                    <BarChart type={type} data={chartData?.debitData || []} date={selectedMonth} />
                </div>
                {/* <div className='my-5'>
                <h4 className='mb-4 cursor-pointer text-decoration-underline' onClick={isDashBoard ? () => navigate(RouteStrings.lendinglist) : () => {
                    setUserView(true)
                    setUserType('lending')
                }}>Lending</h4>
                <BarChart type={type} data={chartData?.lendingData || []} />
            </div> */}
            </div>

            <ModalComponent
                show={isBalanceModal}
                onHide={() => setBalanceModal(false)}
                modal_body={<>
                    <h5>Enter Password to View Balance</h5>
                    <div>
                        <PasswordShowHide
                            name="password"
                            input_label="Password"
                            lableClass="font_color"
                            placeholder="Enter Valid Password"
                            value={password}
                            handleChange={(e) => {
                                setPassword(e.target.value)
                                setPasswordError({ error: false, msg: '' })
                            }}
                            handleFocus={() => { }}
                            formikValidation={<>
                                {isPasswordError.error && <p className='text-danger'>{isPasswordError.msg}</p>}
                            </>}
                        />
                        <div className="text-end">
                            <button type="button" className='btn btn-primary' onClick={() => handleVerifyPassword()} >Verify</button>
                        </div>
                    </div>
                </>} />
        </>
    )
}
