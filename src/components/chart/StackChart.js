import React, { useState, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import { baseURL } from "../../API/API";
import LoaderIcon from "../LoaderIcon";
import { useSelector } from "react-redux";

function StackChart({ data }) {
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const localPlantData = useSelector((state) => state?.plant?.plantData[0]);
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  const [visibleSeries, setVisibleSeries] = useState({});
  const defectsData = useSelector((state) => state.defect.defectsData)

  console.log(defectsData)

  useEffect(() => {

    const colors = {};
    defectsData.forEach((defect) => {
      colors[defect.name] = defect.color_code;
    });
    setDefectColors(colors);

  }, [accessToken]);

  const defectNames = [
    ...new Set(Object.values(data).flatMap((defects) => Object.keys(defects))),
  ];
  const sortedDates = Object.keys(data).sort(
    (a, b) => new Date(a) - new Date(b)
  );


  useEffect(() => {
    const resetVisibility = defectNames.reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {});
    setVisibleSeries(resetVisibility);
  }, [data]);




  const fallbackColors = ["#FF5733", "#e31f09", "#3357FF"];

  const seriesData = defectNames
    .filter((defectName) => visibleSeries[defectName])
    .map((defectName, index) => {
      return {
        name: defectName,
        data: sortedDates.map((date) => data[date][defectName] || 0),
        color:
          defectColors[defectName] ||
          fallbackColors[index % fallbackColors.length],
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
            colors: ["#000"],
          },
        },
      },
      yaxis: {
        min: 0,
        labels: {
          style: {
            fontWeight: 600,
            colors: ["#000"],
          },
        },
      },
      legend: {
        show: false, // Hide default legend

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

  const handleCheckboxChange = (defectName) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [defectName]: !prev[defectName],
    }));
  };

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

      {/* Custom legend with checkboxes */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {defectNames.map((defectName, index) => {
          const color = defectColors[defectName] || fallbackColors[index % fallbackColors.length];
          return (
            <label key={defectName} style={{ marginRight: "10px", display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={visibleSeries[defectName]}
                onChange={() => handleCheckboxChange(defectName)}
                style={{
                  accentColor: color, // Use defect color or fallback
                }}
              />
              <span
                style={{
                  color: "#000", // Use defect color or fallback
                  fontWeight: "600",
                  padding: "5px",
                }}
              >
                {defectName}
              </span>
            </label>
          );
        })}
      </div>

      {/* ApexChart */}
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
