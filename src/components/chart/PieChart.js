import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";

function PieChart({ data }) {
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

  // Group defects by defect name and count occurrences of each defect type
  const groupedData = data.reduce((acc, defect) => {
    if (!acc[defect.defect_name]) {
      acc[defect.defect_name] = 0;
    }
    acc[defect.defect_name]++;
    return acc;
  }, {});

  // Prepare series data and labels for the pie chart
  const seriesData = Object.values(groupedData);
  const labels = Object.keys(groupedData);

  // Generate a color palette based on the number of defect types
  const generateColorPalette = numColors => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      // Use the color from the API if available, otherwise fallback to a default color
      const color = defectColors[labels[i]] || '#000000';
      colors.push(color);
    }
    return colors;
  };

  // Generate colors for the pie chart
  const colors = generateColorPalette(labels.length);

  // Prepare data for the chart
  const chartData = {
    series: seriesData,
    options: {
      chart: {
        width: 380,
        type: 'pie',
      },
      colors: colors, // Specify the colors for the pie chart
      labels: labels,
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  };

  return (
    <div>
      <div>
        <Title level={5}>Pie Chart for Defects</Title>
      </div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="pie"
        height={350}
      />
    </div>
  );
}

export default PieChart;
