    import React, { useState, useEffect } from "react";
    import ReactApexChart from "react-apexcharts";
    import { Timeline, Typography } from "antd";
    import axios from "axios";

    function MachineParam() {
    const { Title } = Typography;
    const [groupedData, setGroupedData] = useState({});
    const[totalData,setTotaldata]=useState(
        [
            {
                "id": 1,
                "params_count": "18484",
                "date_time": "2024-04-22T12:45:40",
                "parameter": "Machine Counter",
                "color_code": "#64096e"
            },
            {
                "id": 2,
                "params_count": "15464",
                "date_time": "2024-04-22T12:45:40",
                "parameter": "Program Counter",
                "color_code": "#6e4699"
            },
            {
                "id": 3,
                "params_count": "800",
                "date_time": "2024-04-22T12:45:40",
                "parameter": "Reject Counter",
                "color_code": "#ed1e07"
            },
            {
                "id": 4,
                "params_count": "10484",
                "date_time": "2024-04-23T12:45:40",
                "parameter": "Machine Counter",
                "color_code": "#64096e"
            },
            {
                "id": 5,
                "params_count": "12464",
                "date_time": "2024-04-23T12:45:40",
                "parameter": "Program Counter",
                "color_code": "#6e4699"
            },
            {
                "id": 6,
                "params_count": "900",
                "date_time": "2024-04-23T12:45:40",
                "parameter": "Reject Counter",
                "color_code": "#ed1e07"
            },
            {
                "id": 7,
                "params_count": "13484",
                "date_time": "2024-04-24T12:45:40",
                "parameter": "Machine Counter",
                "color_code": "#64096e"
            },
            {
                "id": 8,
                "params_count": "11464",
                "date_time": "2024-04-24T12:45:40",
                "parameter": "Program Counter",
                "color_code": "#6e4699"
            },
            {
                "id": 9,
                "params_count": "10000",
                "date_time": "2024-04-24T12:45:40",
                "parameter": "Reject Counter",
                "color_code": "#ed1e07"
            },
            {
                "id": 10,
                "params_count": "13484",
                "date_time": "2024-04-25T12:45:40",
                "parameter": "Machine Counter",
                "color_code": "#64096e"
            },
            {
                "id": 11,
                "params_count": "11464",
                "date_time": "2024-04-25T12:45:40",
                "parameter": "Program Counter",
                "color_code": "#6e4699"
            },
            {
                "id": 12,
                "params_count": "12000",
                "date_time": "2024-04-25T12:45:40",
                "parameter": "Reject Counter",
                "color_code": "#ed1e07"
            }
        ]
    )
 
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8001/machine_params/');
                setTotaldata(res.data); // Update totaldata with the fetched data
            } catch (error) {
                console.error('Error fetching machine parameters:', error);
            }
        };

        getData();
    }, []);

    useEffect(() => {
        // Now you can process totaldata here
        const groupedData = {};

        totalData.forEach(item => {
            const date = item.date_time.split('T')[0]; // Extract date part
            if (!groupedData[date]) {
                groupedData[date] = [];
            }
            groupedData[date].push(item);
            setGroupedData(groupedData)
        });

        // Do something with groupedData, maybe set it to state or use it directly
    }, [totalData]);

    // Extract unique dates
    // console.log(groupedData)

    // Prepare series data
  
 
    const uniqueParameters = [...new Set(totalData.map(item => item.parameter))];
    // Prepare series data
    const seriesData = uniqueParameters.map(parameter => {
        const params = totalData.filter(item => item.parameter === parameter);
        return {
            name: parameter,
            data: params.map(param => parseInt(param.params_count)),
            color: params[0].color_code,
        };
    });
    
    

    // Prepare data for the chart
    const chartData = {
        series: seriesData,
        options: {
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
            show: false
            },
            zoom: {
            enabled: true
            }
        },
        xaxis: {
            categories: Object.keys(groupedData), // Use dates as x-axis categories
        },
        legend: {
            position: 'bottom',
            offsetY: '0'
        },
        fill: {
            opacity: 1
        }
        },
    };

    return (
        <div>
        <div>
            <Title level={5}>Production Vs Scanned Vs Rejected</Title>
        </div>
        <ReactApexChart 
            options={chartData.options} 
            series={chartData.series} 
            type="bar" 
            height={350} 
        />
        </div>
    );
    }

    export default MachineParam;
