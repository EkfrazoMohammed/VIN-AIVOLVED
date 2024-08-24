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
  
  return (
    <div className="py-3 w-full">
      <h1 className="section-title text-xl font-bold text-red-700 ">
        <span className="section-title-overlay">Defects</span>
      </h1>
      <div className="flex items-center space-x-4 mb-4">
      
      </div>
      {/* <div className="flex items-center mb-4 "> */}
        {/* <div className="text-lg">
          <span className="font-semibold text-red-500">Total Defects:</span>{" "}
          <span className="text-red-500">333</span>
        </div> */}
      {/* </div> */}
      <div className="flex w-full gap-3">
        {/* <Bar data={data} options={options} /> */}
        <div className="w-3/6 text-center border-2 rounded-lg p-3">
          {chart1}
        </div>
        <div className="w-3/6 text-center border-2 rounded-lg p-3">
          {chart2}
        </div>
      </div>
    </div>
  );
};

export default ProductAndDefect;
