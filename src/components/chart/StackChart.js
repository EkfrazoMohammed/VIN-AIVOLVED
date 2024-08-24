import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import { baseURL } from "../../API/API";
import LoaderIcon from "../LoaderIcon";
import { useSelector } from "react-redux";

function StackChart({ data }) {
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});

  useEffect(() => {
    axios
      .get(`${baseURL}defect/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const colors = {};
        response.data.results.forEach((defect) => {
          colors[defect.name] = defect.color_code;
        });
        setDefectColors(colors);
      })
      .catch((error) => {
        console.error("Error fetching defect colors:", error);
      });
  }, []);

  const defectNames = [
    ...new Set(Object.values(data).flatMap((defects) => Object.keys(defects))),
  ];
  const sortedDates = Object.keys(data).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const seriesData = defectNames.map((defectName, index) => {
    return {
      name: defectName,
      data: sortedDates.map((date) => data[date][defectName] || 0),
      color:
        defectColors[defectName] ||
        ["#FF5733", "#e31f09", "#3357FF"][index % 3],
    };
  });

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
        animations: {
          enabled: false,
        },
      },
      xaxis: {
        type: "category",
        categories: sortedDates,
        labels: {
          rotate: -45,
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
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
      legend: {
        position: "bottom",
        offsetY: "0",
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
    },
  };

  const daysToShow = 7; 
  const baseWidth = 500; 
  const additionalWidthPerDay = 70;
  const chartWidth =
    sortedDates.length > daysToShow
      ? baseWidth + (sortedDates.length - daysToShow) * additionalWidthPerDay
      : baseWidth;

  if (!data || Object.keys(data).length === 0) {
    return <LoaderIcon text={"Loading..."} />;
  }

  return (
    <div>
      <div>
        <Title level={5} className="text-left font-semibold">
          Bar Graph for Defects
        </Title>
      </div>
      <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
      {/* <div style={{ width: "100%", overflowX: "auto" }}>
        <div style={{ minWidth: `${chartWidth}px`, width: "auto" }}>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        </div>
      </div> */}
    </div>
  );
}

export default StackChart;
