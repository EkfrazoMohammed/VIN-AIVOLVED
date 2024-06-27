import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import { createGlobalStyle } from "styled-components";
import {API, AuthToken, baseURL} from "../../API/API"
function LineChart({ data }) {
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  console.log(data,"<<<line")

  useEffect(() => {
    // Fetch defect colors from the API
    axios.get(`${baseURL}defect/`,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    })
      .then(response => {
        // Organize the response data as an object with defect names as keys and color codes as values
        const colors = {};
        response.data.results.forEach(defect => {
          colors[defect.name] = defect.color_code;
        });
        // Set the defect colors state
        setDefectColors(colors);
      })
      .catch(error => {
        console.error('Error fetching defect colors:', error);
      });
  }, []);

  if (!data || Object.keys(data).length === 0) {
    return <div style={{fontWeight:"700",textAlign:'center'}}>NO DATA</div>; // or some other fallback UI
  }
  console.log(defectColors,"<<<")
  
  // Extract unique defect names from all dates
  const defectNames = [...new Set(Object.values(data).flatMap(defects => Object.keys(defects)))];
  // Sort the dates in ascending order
  const sortedDates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));

  // Prepare series data
  const seriesData = defectNames.map((defectName, index) => {
    return {
      name: defectName,
      data: sortedDates.map(date => data[date][defectName] || 0),
      color: defectColors[defectName] || ['#FF5733', '#e31f09', '#3357FF'][index % 3]
    };
  });

  // Prepare data for the line chart
  const chartData = {
    series: seriesData,
    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      legend: {
        show: true, // Show legend to distinguish between different defect names
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      yaxis: {
        min: 0, // Set the minimum value of y-axis to 0
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },
      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
        categories: sortedDates, // Set categories as sorted dates
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  return (
    <div className="linechart">
      <div>
        <Title level={5}>Defects Count</Title>
      </div>
      {Object.keys(data).length > 0 ?
      
      <ReactApexChart
      className="full-width"
      options={chartData.options}
      series={chartData.series}
      type="line"
      height={350}
      width={"100%"}
    /> : "NO DATA"
    }
 
    </div>
  );
}

export default LineChart;
