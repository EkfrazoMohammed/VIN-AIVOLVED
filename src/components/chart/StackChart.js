import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import {  baseURL } from "../../API/API";
import LoaderIcon from "../LoaderIcon";

import { useSelector, useDispatch } from "react-redux";
function StackChart({ data }) {
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});

  useEffect(() => {
    // Fetch defect colors from the API
    axios
      .get(`${baseURL}defect/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        // Organize the response data as an object with defect names as keys and color codes as values
        const colors = {};
        response.data.results.forEach((defect) => {
          colors[defect.name] = defect.color_code;
        });
        // Set the defect colors state
        setDefectColors(colors);
      })
      .catch((error) => {
        console.error("Error fetching defect colors:", error);
      });
  }, []);

  // Extract unique defect names
  const defectNames = [
    ...new Set(Object.values(data).flatMap((defects) => Object.keys(defects))),
  ];
  // Sort the dates in ascending order
  const sortedDates = Object.keys(data).sort(
    (a, b) => new Date(a) - new Date(b)
  );
  // Prepare series data
  const seriesData = defectNames.map((defectName, index) => {
    return {
      name: defectName,
      data: sortedDates.map((date) => data[date][defectName] || 0),
      color:
        defectColors[defectName] ||
        ["#FF5733", "#e31f09", "#3357FF"][index % 3],
    };
  });

  // Prepare data for the chart
  const chartData = {
    series: seriesData,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      },
      xaxis: {
        type: "category",
        categories: sortedDates,
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
            margin: "10px",
          },
        },
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
      legend: {
        position: "bottom",
        offsetY: "0",
      },
      fill: {
        opacity: 1,
      },
    },
  };


  if (!data || Object.keys(data).length === 0) {
    return (
      <LoaderIcon text={"Loading..."} />
    );
  }

  return (
    <div>
      <div>
        <Title level={5} className="text-left"> Bar Graph for Defects</Title>
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
