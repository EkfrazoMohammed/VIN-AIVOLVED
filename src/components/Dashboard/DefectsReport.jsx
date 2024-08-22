import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { IoFilterSharp } from "react-icons/io5";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const ProductAndDefect = ({ chart1, chart2 }) => {
  const [chartType, setChartType] = useState("bar");

  const data = {
    labels: [
      "2024-07-12",
      "2024-07-13",
      "2024-07-14",
      "2024-07-15",
      "2024-07-16",
    ],
    datasets: [
      {
        label: "Half cut",
        data: [0, 0, 0, 0, 0],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Crack Up",
        data: [0, 10, 20, 30, 40],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Dent",
        data: [5, 10, 946, 1408, 332],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Flute Damage",
        data: [10, 20, 716, 406, 89],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="py-3 w-full">
      <h1 className="section-title text-xl font-bold text-red-700 ">
        <span className="section-title-overlay">Defects</span>
      </h1>
      <div className="flex items-center space-x-4 mb-4">
      
      </div>
      <div className="flex items-center mb-4 ">
        <div className="text-lg">
          <span className="font-semibold text-red-500">Total Defects:</span>{" "}
          <span className="text-red-500">333</span>
        </div>
      </div>
      <div className="flex w-full gap-3">
        {/* <Bar data={data} options={options} /> */}
        <div className="w-1/2 text-center border-2 rounded-lg p-3">
          {chart1}
        </div>
        <div className="w-1/2 text-center border-2 rounded-lg p-3">
          {chart2}
        </div>
      </div>
    </div>
  );
};

export default ProductAndDefect;
