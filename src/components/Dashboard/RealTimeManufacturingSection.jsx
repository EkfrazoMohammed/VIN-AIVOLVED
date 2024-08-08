import React from "react";
import { Bar } from "react-chartjs-2";

export default function RealTimeManufacturingSection({
  loading,
  categoryDefects,
  productionData,
}) {
  // const data = {
  //   labels: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"],
  //   datasets: [
  //     {
  //       label: "Defects",
  //       data: [46, 48, 50, 48, 47, 47, 49, 50],
  //       backgroundColor: "rgba(54, 162, 235, 0.6)",
  //     },
  //   ],
  // };
  const data = {
    labels: productionData.map((item) => item.date),
    datasets: [
      {
        label: "Total Production",
        data: productionData.map((item) => parseInt(item.total_production, 10)),
        backgroundColor: "#ffe3b3",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}M`,
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
    },
  };

  return (
    <div className="py-4 px-0 ">
      <h1 className="section-title  text-red-700 mb-4">
       <span className="section-title-overlay"> Real-Time Manufacturing DPMU</span>
      </h1>
      <div className="flex mb-4">
        <div className="flex-grow mr-4 min-w-52">
          <div className="p-3  mb-2 border-2 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-bold">Total Defects</span>
            </div>

            <div className="text-4xl font-bold text-red-500">
              {Object.values(categoryDefects).reduce(
                (total, category) => total + category,
                0
              )}
            </div>
          </div>
          <div className="p-3  border-2 rounded-md max-h-[350px] overflow-auto">
            <h2 className="text-md font-normal mb-2">Defects by types</h2>
            <ul>
              {loading || !categoryDefects ? (
                <li className="flex justify-center p-2">
                  <span className="max-w-28 text-wrap font-bold text-gray-500">
                    Loading...
                  </span>
                </li>
              ) : (
                Object.keys(categoryDefects).map((category, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-[#ff676e] p-2 mb-2 rounded"
                  >
                    <span className="max-w-28 text-wrap font-bold text-white">
                      {category}
                    </span>
                    <span className="text-white font-bold">
                      {categoryDefects[category]}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className="flex-grow">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}
