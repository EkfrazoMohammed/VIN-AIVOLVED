import React from "react";
import { Bar } from "react-chartjs-2";
import { IoFilterSharp } from "react-icons/io5";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

const ProductAndDefect = ({ chartData }) => {

  const totalProduction = chartData.reduce(
    (sum, item) => sum + parseInt(item.total_production, 10),
    0
  );

  const totalDefects = chartData.reduce(
    (sum, item) => sum + item.total_defects,
    0
  );

  if (!chartData || Object.keys(chartData).length === 0) {
    return (
      <div
        style={{
          fontWeight: "700",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        NO DATA
      </div>
    );
  }

  const data = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: "Total Production",
        data: chartData.map((item) => item.total_production),
        backgroundColor: "#58f558",
      },
      {
        label: "Total Defects",
        data: chartData.map((item) => item.total_defects),
        backgroundColor: "#fc5347",
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: 'y', // This makes the bar chart horizontal
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: 'black',
        font: {
          weight: 'bold'
        },
        formatter: (value) => {
          return value;
        }
      }
    },
    layout: {
      padding: {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
      }
    },
    scales: {
      x: {
        beginAtZero: false,
        grid: {
          display: true // Hide x-axis grid lines if not needed
        }
      },
      y: {
        grid: {
          display: false // Hide y-axis grid lines if not needed
        }
      }
    },
    elements: {
      bar: {
        borderWidth: 2
      }
    },
    animation: {
      duration: 500
    }
  };

  return (
    <div className="py-3 w-full ">
      <h1 className="section-title text-xl font-bold text-red-700 mb-4">
        <span className="section-title-overlay font-bold">
          Production vs Defects
        </span>
      </h1>
      {/* <div className="flex items-center space-x-4 mb-4">
        <button className="p-2 bg-gray-200 rounded">
          <IoFilterSharp />
        </button>
        <select className="p-2 bg-gray-100 rounded border">
          <option>All Products</option>
        </select>
      </div> */}
      <div className="flex gap-4 w-full border-2 rounded-lg p-3  overflow-hidden">
        <div className="w-2/12 min-w-52 rounded-lg bg-gray-100  align-middle flex flex-col gap-4 justify-start p-4 items-start">
          <div className="text-lg mr-4 flex flex-col justify-center ">
            <span className="text-gray-500 font-semibold">Total Production:</span>{" "}
            <span className="text-gray-500 text-2xl font-semibold">
              {totalProduction}
            </span>
          </div>
          <div className="text-lg flex flex-col justify-center">
            <span className="font-semibold text-[#f63640]">Total Defects:</span>{" "}
            <span className="text-[#f63640] text-2xl font-semibold">
              {totalDefects}
            </span>
          </div>
        </div>
        <div className="w-10/12 h-full">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProductAndDefect;
