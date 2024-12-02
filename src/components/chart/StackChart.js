import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography, Spin } from "antd";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

function StackChart({ data, localPlantData, loading }) {
  const { Title } = Typography;
  const defectsData = useSelector((state) => state.defect.defectsData);

  const [defectColors, setDefectColors] = useState({});
  const [visibleSeries, setVisibleSeries] = useState({});
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (defectsData && defectsData.length > 0) {
      const colors = {};
      defectsData.forEach((defect) => {
        colors[defect.name] = defect.color_code;
      });
      setDefectColors(colors);
      setIsDataReady(true);
    }
  }, [defectsData]);

  const defectNames = useMemo(
    () => [...new Set(Object.values(data).flatMap((defects) => Object.keys(defects)))],
    [data]
  );

  const sortedDates = useMemo(() => Object.keys(data).sort((a, b) => new Date(a) - new Date(b)), [data]);

  useEffect(() => {
    const resetVisibility = defectNames.reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {});
    setVisibleSeries(resetVisibility);
  }, [data]);

  const seriesData = useMemo(() => {
    return defectNames
      .filter((defectName) => visibleSeries[defectName])
      .map((defectName) => {
        return {
          name: defectName,
          data: sortedDates.map((date) => data[date][defectName] || 0),
          color: defectColors[defectName],
        };
      });
  }, [defectNames, visibleSeries, sortedDates, defectColors, data]);

  const chartData = useMemo(() => ({
    series: seriesData,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: { show: false },
        zoom: { enabled: true },
        animations: { enabled: false },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(0),
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          colors: ["#000"],
        },
      },
      grid: { show: false },
      xaxis: {
        type: "category",
        categories: sortedDates,
        labels: {
          rotate: -45,
          style: { fontSize: "12px", fontWeight: 600, colors: ["#000"] },
        },
      },
      yaxis: {
        min: 0,
        labels: { style: { fontWeight: 600, colors: ["#000"] } },
      },
      legend: { show: false },
      fill: { opacity: 1 },
      plotOptions: {
        bar: { columnWidth: sortedDates.length > 7 ? "80%" : "50%" },
      },
    },
  }), [seriesData, sortedDates]);

  const handleCheckboxChange = (defectName) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [defectName]: !prev[defectName],
    }));
  };


  const getChartWidth = () => {
    if (sortedDates.length <= 5) {
      return "100%";
    } else if (sortedDates.length > 5 && sortedDates.length <= 10) {
      return `${sortedDates.length * 14}%`; // Adjust for better scaling
    } else {
      return `${sortedDates.length * 15}%`; // Adjust for large datasets
    }
  };

  return (
    <div>
      <div>
        <Title level={5} className="text-left font-semibold">
          Bar Graph for Defects
        </Title>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {defectNames.map((defectName) => {
          const color = defectColors[defectName] || "#cccccc"; // Default color if not loaded
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
                style={{ accentColor: color }}
              />
              <span style={{ color: "#000", fontWeight: "600", padding: "5px" }}>
                {defectName}
              </span>
            </label>
          );
        })}
      </div>
      <div className="w-full flex justify-center">
        {loading || !isDataReady ? (
          <div className="flex items-center justify-center w-full h-48">
   <Spin tip="Loading" size="medium" />
 
             </div>
        ) : Object.keys(data).length === 0 ? (
          <div className="flex items-center justify-center w-full h-48 font-bold">
            NO DATA
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              overflowX: sortedDates.length > 7 ? "auto" : "hidden",
            }}
          >
            <ReactApexChart
              options={chartData.options}
              series={chartData.series}
              type="bar"
              height={350}
              width={getChartWidth()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

StackChart.propTypes = {
  data: PropTypes.object.isRequired,
  localPlantData: PropTypes.any, // Add prop types if needed for this prop
  loading: PropTypes.bool, // Optional prop to indicate loading state
};

export default StackChart;
