import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from 'axios'
import { baseURL } from "../../API/API";

function StackChart({ data }) {
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});

  useEffect(() => {
    // Fetch defect colors from the API
    axios.get(`${baseURL}defect/`)
      .then(response => {
        // Organize the response data as an object with defect names as keys and color codes as values
        const colors = {};
        response.data.forEach(defect => {
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
    return <div>Loading...</div>; // or some other fallback UI
  }

  // Extract unique defect names
  const defectNames = [...new Set(Object.values(data).flatMap(defect => Object.keys(defect)))];

  // Sort the dates in ascending order
  const sortedDates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));

  // Prepare series data with dynamically assigned colors
  const seriesData = defectNames.map((defectName, index) => ({
    name: defectName,
    data: sortedDates.map(date => data[date][defectName] || 0),
    color: defectColors[defectName] || ['#FF5733', '#e31f09', '#3357FF'][index % 3]

    // You can set the color here if needed
  }));

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
        type: 'category',
        categories: sortedDates,
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
        <Title level={5}>Bar Graph for Defects</Title>
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

export default StackChart;
