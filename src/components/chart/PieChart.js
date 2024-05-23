import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";

function PieChart({ data }) {
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  const [chartData, setChartData] = useState({ labels: [], series: [] });

  useEffect(() => {
    // Fetch defect colors from the API
    axios.get('http://vin.aivolved.in:8100/defect/')
      .then(response => {
        const colors = {};
        response.data.forEach(defect => {
          colors[defect.name] = defect.color_code;
        });
        setDefectColors(colors);
      })
      .catch(error => {
        console.error('Error fetching defect colors:', error);
      });
  }, []);

  useEffect(() => {
    if (!data || typeof data !== 'object') return;

    const aggregatedData = Object.values(data).reduce((acc, defects) => {
      Object.entries(defects).forEach(([defect, count]) => {
        if (!acc[defect]) {
          acc[defect] = 0;
        }
        acc[defect] += count;
      });
      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const series = Object.values(aggregatedData);

    setChartData({ labels: labels, series: series });
  }, [data]);

  return (
    <div>
      <div>
        <Title level={5}>Pie Chart for Defects</Title>
      </div>
      <ReactApexChart
        options={{
          chart: {
            width: 380,
            type: 'pie',
          },
          colors: chartData.labels.map(label => defectColors[label] || '#FF5733'), // Default color if no color code found
          labels: chartData.labels,
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
        }}
        series={chartData.series}
        type="pie"
        height={350}
      />
    </div>
  );
}

export default PieChart;
