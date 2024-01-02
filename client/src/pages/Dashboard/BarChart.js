// // import React from 'react';
// // import { Bar } from 'react-chartjs-2';

// // export const BarChart = () => {
// //     // const data = {
// //     //     labels: ['January', 'February', 'March', 'April', 'May'],
// //     //     datasets: [
// //     //         {
// //     //             label: 'Sales Data',
// //     //             backgroundColor: 'rgba(75,192,192,0.2)',
// //     //             borderColor: 'rgba(75,192,192,1)',
// //     //             borderWidth: 1,
// //     //             hoverBackgroundColor: 'rgba(75,192,192,0.4)',
// //     //             hoverBorderColor: 'rgba(75,192,192,1)',
// //     //             data: [65, 59, 80, 81, 56],
// //     //         },
// //     //     ],
// //     // };

// //     const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
// //     const data = {
// //         labels: labels,
// //         datasets: [{
// //             label: 'My First Dataset',
// //             data: [65, 59, 80, 81, 56, 55, 40],
// //             backgroundColor: [
// //                 'rgba(255, 99, 132, 0.2)',
// //                 'rgba(255, 159, 64, 0.2)',
// //                 'rgba(255, 205, 86, 0.2)',
// //                 'rgba(75, 192, 192, 0.2)',
// //                 'rgba(54, 162, 235, 0.2)',
// //                 'rgba(153, 102, 255, 0.2)',
// //                 'rgba(201, 203, 207, 0.2)'
// //             ],
// //             borderColor: [
// //                 'rgb(255, 99, 132)',
// //                 'rgb(255, 159, 64)',
// //                 'rgb(255, 205, 86)',
// //                 'rgb(75, 192, 192)',
// //                 'rgb(54, 162, 235)',
// //                 'rgb(153, 102, 255)',
// //                 'rgb(201, 203, 207)'
// //             ],
// //             borderWidth: 1
// //         }]
// //     };


// //     const config = {
// //         type: 'bar',
// //         data: data,
// //         options: {
// //             scales: {
// //                 y: {
// //                     beginAtZero: true
// //                 }
// //             }
// //         },
// //     };
// //     // const options = {
// //     //     scales: {
// //     //         y: {
// //     //             beginAtZero: true,
// //     //         },
// //     //     },
// //     // };

// //     return <Bar data={config} />;
// // };

// import React from 'react';
// import { useState } from 'react';
// import { useEffect } from 'react';
// import Chart from 'react-apexcharts';

// export const BarChart = (props) => {
//     const { data, type } = props
//     const [yearData, setYearData] = useState([])

//     const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

//     const monthDataList = (array) => {
//         let monthdata = monthList.map(month => {
//             let matchingvalue = array.find(item => item.month === month)
//             return matchingvalue ? matchingvalue.totalAmount : 0
//         })
//         return monthdata
//     }
//     useEffect(() => {
//         if (type === "year" && data.length > 0) {
//             let _data = data?.map(item => item.year)
//             setYearData(_data)
//         }
//     }, [data, type])

//     const options = {
//         chart: {
//             type: 'bar',

//         },
//         xaxis: {
//             categories: type === "month" ? monthList : yearData,
//             title: {
//                 text: type,
//             },
//         },
//         yaxis: {
//             title: {
//                 text: 'Amount',
//             },
//         },
//     };

//     const series = [
//         {
//             name: 'Amount',
//             data: type === "month" ? monthDataList(data) : [],
//         },
//     ];
//     // data.length > 0 ? data.map(item => item.totalAmount) : []
//     return <Chart options={options} series={series} type="bar" height={350} />
// };



import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

export const BarChart = (props) => {
    const { data, type } = props

    const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const monthDataList = (array) => {
        let monthdata = monthList.map(month => {
            let matchingvalue = array.find(item => item.month === month)
            return matchingvalue ? matchingvalue.totalAmount : 0
        })
        return monthdata
    }

    const [chartData, setChartData] = useState({
        options: {
            chart: {
                type: 'bar',
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
        ],
    });

    useEffect(() => {
        // Fetch your data from the API
        const fetchData = async () => {
            try {
                let _dataCategories = type === "year" ? data.map(item => item.year) : monthList
                let _dataSeries = type === "year" ? data.map(item => item.totalAmount) : monthDataList(data)

                // Update the state with new data
                setChartData({
                    options: {
                        ...chartData.options,
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
                    ],
                });
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchData();
    }, [data]);

    return <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />;
};

