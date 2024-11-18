import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function StackChart({ data }) {
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  const [visibleSeries, setVisibleSeries] = useState({});
  const defectsData = useSelector((state) => state.defect.defectsData);

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
        colors:"#000",
     
       
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
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val.toFixed(0);
        },

        style: {
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 'bold',
          colors: ["#000"],
          textShadow: "none",
        },
        dropShadow: {
          enabled: false, // Ensures no shadow covers the text
        },

      },
      grid: {
        show:false},
      
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
        show: false,
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {
        bar: {
          columnWidth: sortedDates.length > 7 ? "80%" : "50%",
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
  const getChartWidth = () => {
    if (sortedDates.length <= 5) {
      return "100%";
    } else if (sortedDates.length > 5) {
      return `${sortedDates.length * 14}%`;
    } else {
      return `${sortedDates.length * 50}%`;
    }
  };


  return (
    <div >
      <div>
        <Title level={5} className="text-left font-semibold">
          Bar Graph for Defects
        </Title>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {defectNames.map((defectName, index) => {
          const color = defectColors[defectName] || fallbackColors[index % fallbackColors.length];
          return (
            <label
              key={defectName}
              style={{
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                checked={visibleSeries[defectName]}
                onChange={() => handleCheckboxChange(defectName)}
                style={{
                  accentColor: color,
                }}
              />
              <span
                style={{
                  color: "#000",
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
     <div className="w-full flex justify-center ">
      {
        !data || Object.keys(data).length === 0 ? (
          <div className="flex items-center justify-center w-full h-48 font-bold ">
            NO DATA
          </div>
        ) : (
          <div
            style={{
              width: "92%",
              overflowX: sortedDates.length > 7 ? "auto" : "hidden", // Enable horizontal scroll if there are more than 7 dates
            }}
          >
    
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="bar"
                height={350}
                width={getChartWidth()} // Call the function to get the width
                />
            </div>
        )
      }
     </div>
    </div>
  );
}

StackChart.propTypes ={
  data:PropTypes.any
}

export default StackChart;
