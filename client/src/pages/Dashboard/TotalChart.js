import React, { useEffect, useState } from 'react'
import { BarChart } from './BarChart'
import { PostRequestHook } from '../../apis/Services'
import { configUrl } from '../../apis/api.config'
import { useSelector } from 'react-redux'
import './Dashboard.scss'
import { useNavigate } from 'react-router-dom'
import { RouteStrings } from '../../utils/common'

export const TotalChart = (props) => {
    const { userId, isDashBoard, setUserView, setUserType } = props
    // console.log("🚀 ~ file: TotalChart.js:12 ~ TotalChart ~ isDashBoard:", isDashBoard)
    const { getRequest } = PostRequestHook()
    const navigate = useNavigate()
    // const { userInfo } = useSelector(state => state.UIStore)
    // let userId = userInfo?.userId || null

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, index) => currentYear - index);

    const [chartData, setChartData] = useState({})
    const [type, setType] = useState("month")
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(`${currentYear}-${currentMonth}`);

    useEffect(() => {
        getChartData(userId, type, `${currentYear}-${currentMonth}`)
    }, [])

    const getChartData = async (user, type, date) => {
        let response = await getRequest(`${configUrl.getChartData}${user}/${type}/${date}`)
        setChartData(response?.data?.data || {})
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
            {isDashBoard && <div className='userBox my-5' onClick={() => navigate(RouteStrings.users)}>
                <h5 className='mb-4'>Total Active Users</h5>
                <h5 className='text-end m-0'>{chartData?.totalUsers || 0}</h5>
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
                <h4 className='mb-4 cursor-pointer text-decoration-underline' onClick={isDashBoard ? () => navigate(RouteStrings.creditlist) : () => {
                    setUserView(true)
                    setUserType("credit")
                }}>Credit</h4>
                <BarChart type={type} data={chartData?.creditData || []} />
            </div>
            <div className='my-5'>
                <h4 className='mb-4 cursor-pointer text-decoration-underline' onClick={isDashBoard ? () => navigate(RouteStrings.debitlist) : () => {
                    setUserView(true)
                    setUserType('debit')
                }}>Debit</h4>
                <BarChart type={type} data={chartData?.debitData || []} />
            </div>
            <div className='my-5'>
                <h4 className='mb-4 cursor-pointer text-decoration-underline' onClick={isDashBoard ? () => navigate(RouteStrings.lendinglist) : () => {
                    setUserView(true)
                    setUserType('lending')
                }}>Lending</h4>
                <BarChart type={type} data={chartData?.lendingData || []} />
            </div>
        </div>
    )
}
