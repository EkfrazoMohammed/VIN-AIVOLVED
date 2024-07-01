import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import { baseURL } from "../../API/API";

function MachineParam() {
  const { Title } = Typography;
  const [totalData, setTotalData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const localItems = localStorage.getItem("PlantData")
  const localPlantData = JSON.parse(localItems) 
  const results =   [
    {
        "date_time": "2024-06-17",
        "defect_percentage": 0
    },
    {
        "date_time": "2024-06-20",
        "defect_percentage": 50
    }
]
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${baseURL}params_graph/?plant_id=${localPlantData.id}`);
        if (res.data.results.length > 0) {
          const modifiedData = res.data.results.map(item => ({
            ...item,
            date_time: item.date_time.split('T')[0]
          }));
          setTotalData(modifiedData);
          console.log(modifiedData,"<<<")
        }
      } catch (error) {
        console.error("Error fetching machine parameters:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (totalData.length === 0) return; // Check if totalData is empty
    const groupedData = {};
    totalData.forEach(item => {
      const date = item.date_time;
      if (!groupedData[date]) {
        groupedData[date] = {};
      }
      if (!groupedData[date][item.parameter]) {
        groupedData[date][item.parameter] = 0;
      }
      // groupedData[date][item.parameter] += parseInt(item.defect_percentage);
      groupedData[date][item.parameter] += parseFloat(item.defect_percentage);
    });

    const categories = Object.keys(groupedData);
    const allParameters = new Set(totalData.map(item => item.parameter));
    // const seriesData = Array.from(allParameters).map(parameter => {
       
    //   return {
    //     name: "DPMU",
    //     data: categories.map(date => groupedData[date][parameter] || 0),
    //     color: totalData.find(item => item.parameter === parameter).color_code
    //   };
    // }).filter(series => series.data.some(count => count > 0)); // Remove series with count 0 for all dates
    const seriesData = Array.from(allParameters).map(parameter => {
      return {
        name: "DPMU",
        data: categories.map(date => Math.round(groupedData[date][parameter] || 0)),
        color: totalData.find(item => item.parameter === parameter).color_code
      };
    }).filter(series => series.data.some(count => count > 0)); // Remove series with count 0 for all dates

    setChartSeries(seriesData);

    const chartOptions = {
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
        categories: categories,
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            return Math.round(val);
          }
        }
      },
   
      legend: {
        position: 'bottom',
        offsetY: '0'
      },
      fill: {
        opacity: 1
      }
    };
    setChartOptions(chartOptions);
  }, [totalData]);

  console.log(chartOptions)

  return (
    <div>
      <div>
        <h4>Realtime DPMU</h4>
      </div>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default MachineParam;
