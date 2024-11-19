import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch } from "react-redux";
import { setSelectedMachineDpmu } from "../../redux/slices/machineSlice";
import PropTypes from "prop-types";

export default function RealTimeManufacturingSection({
  loading,
  categoryDefects,
  productionData,
}) {
  const dispatch = useDispatch();

  // Prepare the chart data
  const data = {
    labels: productionData?.map((item) => item.date_time),
    datasets: [
      {
        label: "Defect Percentage",
        data: productionData?.map((item) => parseInt(item.defect_percentage, 10)),
        backgroundColor: "#5190dd",
 
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to resize dynamically
  
    plugins: {
      legend: {
        display: false,
    
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}M`,
        },
      },
      datalabels: {
        color: "#ffff", // Change the color of the data labels to red
      
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
        grid: {
          display: false, // Hide the X-axis grid lines to make the chart cleaner
        },
        ticks: {
          autoSkip: false, // Display all labels without skipping
          maxRotation: 90, // Rotate labels to avoid overlap
          minRotation: 45, // Minimum rotation angle for labels
        },
      },
    },
  };

  // Reset selected machine on component mount
  useEffect(() => {
    dispatch(setSelectedMachineDpmu(null));
  }, [dispatch]);

  return (
    <div className="py-4 px-0">
    <h1 className="section-title text-red-700 mb-4">
      <span className="section-title-overlay font-bold">Real-Time Manufacturing DPMU</span>
    </h1>
    <div className="flex mb-4">
      {/* Left Panel */}
      <div className="flex-grow mr-4 min-w-52 max-w-96">
        <div className="p-3 mb-2 border-2 rounded-md bg-[#ffe0e2]">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Total Defects</span>
          </div>
          <div className="text-4xl font-semibold text-red-500">
            {Object.values(categoryDefects).reduce(
              (total, category) => total + category,
              0
            )}
          </div>
        </div>
        <div className="p-2 border-1 rounded-md max-h-[350px] overflow-auto bg-[#D2D7E9] ">
          <h2 className="text-lg mb-2 font-semibold text-[#4A5068]">Defects by types</h2>
          <ul>
            {loading || !categoryDefects ? (
              <li className="flex justify-center p-2">
                <span className="max-w-28 text-wrap font-bold text-gray-500">Loading...</span>
              </li>
            ) : (
              Object.keys(categoryDefects).map((category, index) => (
                <li
                  key={category.id}
                  className="flex justify-between items-center bg-[#ff676e] p-2 mb-2 rounded"
                >
                  <span className="max-w-32 text-wrap font-bold  break-words ">
                    {category}
                  </span>
                  <span className=" font-bold text">{categoryDefects[category]}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Right Panel - Bar Chart */}
      <div className="flex w-[75%]">
{
  !productionData?.every(item => item.defect_percentage === 0) ? (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        overflowX: productionData?.length > 15 ? "auto" : "visible", // Enable scroll if more than 15 items
      }}
    >
      <div
      className="bg-white py-3 px-1 rounded-md"
        style={{
          width: productionData?.length * 5 + "%", // Adjust the width based on the number of items (adjust 60 as needed)
          minWidth: "100%",  // Ensures the container always takes up at least the full width of the parent
          height: "400px", // Set a fixed height for the chart
          display: "flex", // Allow the chart to grow
          justifyContent: "flex-start", // Align content to the left to avoid empty space
        }}
      >
        <Bar data={data} options={options} className="w-full" />
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center font-extrabold h-52 text-center w-full">
      NO DATA
    </div>
  )
}
</div>


    </div>
  </div>
  );
}

RealTimeManufacturingSection.propTypes = {
  loading:PropTypes.any,
  categoryDefects:PropTypes.any,
  productionData:PropTypes.any
};

