import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { setSelectedMachineDpmu } from "../../redux/slices/machineSlice";
import PropTypes from "prop-types";
import { Spin ,ConfigProvider } from "antd";

export default function RealTimeManufacturingSection({
  loading: externalLoading,
  categoryDefects,
  productionData,
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 4000); 
   return () => clearTimeout(timeout);
  }, [productionData]);

  


  // Helper to calculate total defects
  const totalDefects = Object.values(categoryDefects || {}).reduce(
    (total, count) => total + count,
    0
  );

  // Chart Data
  const data = {
    labels: productionData?.map((item) => item.date_time),
    datasets: [
      {
        label: "Defect Percentage",
        data: productionData?.map((item) =>
          parseInt(item.defect_percentage, 10)
        ),
        backgroundColor: "#5190dd",
        minBarLength: 15,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}M`,
        },
      },
      datalabels: {
        color: "#ffff",
        font: {
          size: productionData?.length > 15 ? 7 : 10,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}M`,
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 45,
        },
      },
    },
  };



  // Render: Total Defects Card
  const renderTotalDefectsCard = () => (
    <div className="p-3 mb-2 border-2 rounded-md bg-[#ffe0e2]">
      <div className="flex justify-between items-center mb-2">
        <span className="text-lg font-semibold">Total Defects</span>
      </div>
      <div className="text-4xl font-semibold text-red-500">{totalDefects}</div>
    </div>
  );

  // Render: Defects by Type List
  const renderDefectsList = () => (
    <div className="p-2 border-1 rounded-md max-h-[350px] overflow-auto bg-[#D2D7E9]">
      <h2 className="text-lg mb-2 font-semibold text-[#4A5068]">
        Defects by Types
      </h2>
      <ul>
        {(externalLoading || isLoading) ? (
          <li className="flex justify-center p-2">
            <span className="max-w-28 text-wrap font-bold text-gray-500">
              Loading...
            </span>
          </li>
        ) : (
          Object.keys(categoryDefects || {}).map((category) => (
            <li
              key={category}
              className="flex justify-between items-center bg-[#ff676e] p-2 mb-2 rounded"
            >
              <span className="max-w-32 text-wrap font-bold break-words">
                {category}
              </span>
              <span className="font-bold">{categoryDefects[category]}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  // Render: Bar Chart
  const renderBarChart = () => (
    <div
      className="bg-white py-3 px-1 rounded-md"
      style={{
        width: productionData?.length * 5 + "%",
        minWidth: "100%",
        height: "400px",
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Bar data={data} options={options} className="w-full" />
    </div>
  );

  return (
    <div className="py-4 px-0">
      <h1 className="section-title text-red-700 mb-4">
        <span className="section-title-overlay font-bold">
          Real-Time Manufacturing DPMU
        </span>
      </h1>
      <div className="flex mb-4">
        {/* Left Panel */}
        <div className="flex-grow mr-4 min-w-52 max-w-96">
          {renderTotalDefectsCard()}
          {renderDefectsList()}
        </div>

        {/* Right Panel */}
        <div className="flex w-[75%] bg-white rounded-md">
          { isLoading ? (
            <div className="flex justify-center items-center w-full">
             <Spin size="large"  tip="Loading"/>
            </div>
          ) : productionData?.every((item) => item.defect_percentage === 0) ? (
            <div className="flex justify-center items-center font-extrabold h-52 text-center w-full">
              NO DATA
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                overflowX: productionData?.length > 15 ? "auto" : "visible",
              }}
            >
              {renderBarChart()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

RealTimeManufacturingSection.propTypes = {
  loading: PropTypes.bool,
  categoryDefects: PropTypes.object,
  productionData: PropTypes.array,
};
