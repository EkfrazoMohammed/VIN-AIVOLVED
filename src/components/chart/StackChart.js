import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";

function StackChart({ data }) {
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});

  useEffect(() => {
    // Fetch defect colors from the API
    axios.get('http://127.0.0.1:8001/defect/')
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

  // Extract unique defect names
  const defectNames = [...new Set(data.map(defect => defect.defect_name))];

  // // Group defects by date and count occurrences of each defect type
  // const groupedData = {};
  // data.forEach(defect => {
  //   const date = new Date(defect.recorded_date_time); // Parse recorded_date_time into a valid Date object
  //   const dateString = date.toISOString().split('T')[0]; // Get the date string in 'YYYY-MM-DD' format
  //   // console.log('this is the date', dateString);
  //   if (!groupedData[dateString]) {
  //     groupedData[dateString] = {};
  //   }
  //   defectNames.forEach(defectName => {
  //     if (!groupedData[dateString][defectName]) {
  //       groupedData[dateString][defectName] = 0;
  //     }
  //     if (defect.defect_name === defectName) {
  //       groupedData[dateString][defectName]++;
  //     }
  //   });
  // });
// Group defects by date and count occurrences of each defect type
const groupedData = {};
data.forEach(defect => {
  let dateString = defect.recorded_date_time;
  // Check if the date string contains 'T' separator
  if (dateString.includes('T')) {
    dateString = dateString.split('T')[0]; // Get the date part before 'T'
  } else {
    dateString = dateString.split(' ')[0]; // Get the date part before the first space
  }
  
  // console.log(dateString)
  if (!groupedData[dateString]) {
    groupedData[dateString] = {};
  }
  defectNames.forEach(defectName => {
    if (!groupedData[dateString][defectName]) {
      groupedData[dateString][defectName] = 0;
    }
    if (defect.defect_name === defectName) {
      groupedData[dateString][defectName]++;
    }
  });
});


console.log(groupedData)
  // Sort the dates in ascending order
  const sortedDates = Object.keys(groupedData).sort((a, b) => new Date(a) - new Date(b));

  // Prepare series data with dynamically assigned colors
  const seriesData = defectNames.map((defectName, index) => ({
    name: defectName,
    data: sortedDates.map(date => groupedData[date][defectName] || 0),
    color: defectColors[defectName] || ['#FF5733', '#e31f09', '#3357FF'][index % 3] // Use custom colors for bars or fallback to defaults
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
        type: 'date',
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
