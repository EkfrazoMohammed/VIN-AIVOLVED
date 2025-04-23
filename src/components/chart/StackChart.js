import React, { useState, useEffect, useMemo, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Typography, Spin } from "antd";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function StackChart({ data, localPlantData, loading ,dateRange }) {
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
          label: defectName,
          data: sortedDates.map((date) => data[date][defectName] || 0),
          backgroundColor: defectColors[defectName] || "#cccccc", // Default color if not loaded
          barThickness: 40,
        };
      });
  }, [defectNames, visibleSeries, sortedDates, defectColors, data]);

  const chartData = useMemo(() => ({
    labels: sortedDates,
    datasets: seriesData,
   
  }), [seriesData, sortedDates]);

  const handleCheckboxChange = (defectName) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [defectName]: !prev[defectName],
    }));
  };

  // Calculate dynamic barThickness based on the number of dates
  const getBarThickness = () => {
    if (sortedDates.length <= 5) {
      return "20%"; // Wide bars for few data points
    } else if (sortedDates.length <= 10) {
      return "30%"; // Medium bars for moderate data points
    } else {
      return  "100%"; // Narrow bars for many data points
    }
  };

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Reset the scroll position to the top whenever sortedDates or chartData changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [sortedDates, chartData]);
  

  return (
    <div>
      <div>
        <Title level={5} className="text-left font-semibold">
          Bar Graph for Defects ({dateRange[0]} to {dateRange[1]})
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
              overflowX: sortedDates.length > 7 ? "auto" : "visible", // Only apply scroll for more than 10 dates
            }}
            ref={scrollContainerRef}
          >
            <div
               style={{
                width: sortedDates?.length > 7 ? sortedDates?.length * 20 + "%" : sortedDates?.length * 7 + "%"  ,
                minWidth: "100%",
                height: "400px",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >

       <Bar
  data={chartData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    animation:false,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        display: false,
      },
      legend: {
        display: false,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}`,
        },
      },
      datalabels: {
        display:false,
        display: (context) => {
          const datasetIndex = context.datasetIndex; // Current dataset index
          const dataIndex = context.dataIndex; // Current data index
          const value = context.dataset.data[dataIndex]; // Current value
    
          // Get all values for the current bar (across all datasets)
          const barValues = context.chart.data.datasets.map(
            (dataset) => dataset.data[dataIndex]
          );
    
          // Find the top 4 largest values for the current bar
          const topValues = [...barValues]
            .sort((a, b) => b - a)
            .slice(0, 3);
    
          // Display label only if the current value is in the top 4 for this bar
          return value > 0 && topValues.includes(value);
        },
               color: "#000",
               fontWeight:"bold",
        font: {
          size:sortedDates?.length > 15 ? 7 : 10,
        },
        formatter: (value) => (value > 0 ? value : "")
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 12 ,
            weight: "600",
          },
        },
        // Ensure categoryPercentage is set to 1, this prevents bars from being too narrow
        categoryPercentage: 5,
        barPercentage: 1,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          font: {
            weight: "600",
     
          },
          callback: (value) => `${value}`,
        },
      },
    },
    elements: {
      bar: {
        // Dynamically set the barThickness
        barThickness: 30,
      },
    },
  }}
/>

            </div>
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
