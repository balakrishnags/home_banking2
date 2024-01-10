import React, { useEffect, useState } from 'react'
import { BarChart } from './BarChart'
import { PostRequestHook } from '../../apis/Services'
import { configUrl } from '../../apis/api.config'
import { useSelector } from 'react-redux'
import './Dashboard.scss'
import { useNavigate } from 'react-router-dom'
import { RouteStrings } from '../../utils/common'
import { customMethods } from '../../utils/Custom'

export const TotalChart = (props) => {
    const { userId, isDashBoard, setUserView, setUserType } = props

    const { getRequest } = PostRequestHook()
    const navigate = useNavigate()
    const { balance, totalUsers } = useSelector(state => state.UIStore)

    const currentYear = new Date().getFullYear();
    const currentMonth = (new Date().getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });;
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => currentYear - index);

    const [chartData, setChartData] = useState({})
    const [type, setType] = useState("month")
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${currentMonth}`);
    const [userBalnce, setUserBalance] = useState(0)

    useEffect(() => {
        getChartData(userId, type, `${currentYear}-${currentMonth}`)
        getAvailableBalance(userId)
    }, [])

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

    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    return (
        <div className='my-5'>
            {isDashBoard && <>
                <div className='text-end mb-4'>
                    <h4 className='text-decoration-underline'>Your Account Balance - &#8377; {customMethods.numberFormat(balance) || 0}</h4>
                </div>
                <div className='userBox my-5' onClick={() => navigate(RouteStrings.users)}>
                    <h5 className='mb-4'>Total Active Users</h5>
                    <h5 className='text-end m-0'>{totalUsers || 0}</h5>
                </div>
            </>}

            {!isDashBoard && <div className='mb-4'>
                <h5 className='text-decoration-underline'>Account Balance -- &#8377; {customMethods.numberFormat(userBalnce) || 0}</h5>
            </div>}
            <div className="d-flex justify-content-end gap-4">
                <div>
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
                </div>
                <div>
                    <div className='mb-2'>
                        <label htmlFor="datemonth"><strong>Search by Month</strong></label>
                    </div>
                    <input type="month" name="datemonth" id="datemonth" className='drpheight' value={selectedMonth} onChange={(e) => handleMonthChange(e)} />
                </div>
            </div>
            <div className="my-5">
                <h4 className='mb-3 text-decoration-underline'>Expenditure of {type} - {type === "month" && `${monthList[new Date(selectedMonth).getMonth()]}, `}{type === "month" ? new Date(selectedMonth).getFullYear() : selectedYear}</h4>
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
    )
}
