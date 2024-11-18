import React from "react";
import PropTypes from "prop-types";

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
      <div className="flex w-full gap-3">
        <div className="w-3/6 text-center  rounded-lg p-3 bg-white  ">
          {chart1}
        </div>
        <div className="w-3/6 text-center rounded-lg p-3 bg-white">
          {chart2}
        </div>
      </div>
    </div>
  );
};
ProductAndDefect.propTypes = {
  chart1:PropTypes.any,
  chart2:PropTypes.any
};

export default ProductAndDefect;
