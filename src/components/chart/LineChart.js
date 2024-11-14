import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import {baseURL} from "../../API/API"
import PropTypes from "prop-types";
function LineChart({ data }) {
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  const AuthToken = useSelector((state) => state.auth.authData.access_token);
  useEffect(() => {
    axios.get(`${baseURL}defect/`,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    })
      .then(response => {
        const colors = {};
        response.data.results.forEach(defect => {
          colors[defect.name] = defect.color_code;
        });
        setDefectColors(colors);
      })
      .catch(error => {
        console.log('Error fetching defect colors:', error);
      });
  }, []);

  if (!data || Object.keys(data).length === 0) {
    return <div style={{fontWeight:"700",textAlign:'center'}}>NO DATA</div>; // or some other fallback UI
  }
  const defectNames = [...new Set(Object.values(data).flatMap(defects => Object.keys(defects)))];
  const sortedDates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
  const seriesData = defectNames.map((defectName, index) => {
    return {
      name: defectName,
      data: sortedDates.map(date => data[date][defectName] || 0),
      color: defectColors[defectName] || ['#FF5733', '#e31f09', '#3357FF'][index % 3]
    };
  });
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
        show: true, 
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      yaxis: {
        min: 0, 
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
        categories: sortedDates,
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
LineChart.propTypes = {
data:PropTypes.any
};

export default LineChart;
