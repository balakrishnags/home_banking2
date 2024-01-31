import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { customMethods } from '../../utils/Custom';

export const BarChart = (props) => {
    const { data, type, date } = props

    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const dayList = customMethods.getDaysInMonth(date)

    const monthDataList = (array) => {
        let monthdata = monthList.map(month => {
            let matchingvalue = array.find(item => item.month === month)
            return matchingvalue ? matchingvalue.totalAmount : 0
        })
        return monthdata
    }
    const dayDataList = (array) => {
        let daydata = dayList.map(day => {
            let matchingvalue = array.find(item => item.day === day)
            return matchingvalue ? matchingvalue.totalAmount : 0
        })
        return daydata
    }

    const [chartData, setChartData] = useState({
        options: {
            chart: {
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        orientation: 'horizontal'
                    }
                },
            },
            xaxis: {
                title: {
                    text: 'Month',
                },
            },
            yaxis: {
                title: {
                    text: 'Amount',
                },
            },
        },
        series: [
            {
                name: 'Amount',
                data: [],
            },
        ]
    });


    useEffect(() => {
        // Fetch data from the API
        const fetchData = async () => {
            try {
                let _dataCategories = type === "year" ? monthList : (type === "allyear" ? data.map(item => item.year) : dayList)
                let _dataSeries = type === "year" ? monthDataList(data) : (type === "allyear" ? data.map(item => item.totalAmount) : dayDataList(data))

                // Update the state with new data
                setChartData({
                    options: {
                        ...chartData.options,
                        plotOptions: {
                            bar: {
                                dataLabels: {
                                    orientation: type === "allyear" ? 'horizontal' : 'vertical'
                                }
                            },
                        },
                        xaxis: {
                            ...chartData.options.xaxis,
                            title: type,
                            categories: _dataCategories,
                        },
                    },
                    series: [
                        {
                            ...chartData.series[0],
                            data: _dataSeries,
                        },
                    ]
                });
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data]);

    return <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />;
};

