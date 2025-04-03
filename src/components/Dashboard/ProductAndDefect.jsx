import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Spin } from "antd";

Chart.register(ChartDataLabels);

const ProductAndDefect = ({ chartData,  textActive }) => {


  const [loading , setLoading] = useState(true)
  useEffect(()=>{
setTimeout(()=>{
setLoading(false)
},[4000])
  },[chartData])

  const totalProduction = chartData.reduce(
    (sum, item) => sum + parseInt(item.total_production, 10),
    0
  );

  const totalDefects = chartData.reduce(
    (sum, item) => sum + Number(item.total_defects),
    0
  );


  const data = {
    labels: chartData.map((item) => item.date),
    datasets: [
      {
        label: "Total Production",
        data: chartData.map((item) => item.total_production),
        backgroundColor: "#58f558",
        minBarLength: 10, // Minimum visible size of production bars
      },
      {
        label: "Total Defects",
        data: chartData.map((item) => item.total_defects),
        backgroundColor: "#fc5347",
        minBarLength: 10, // Minimum visible size of defect bars
      },
    ],
  };

  const maxValue = Math.max(...data.datasets[0].data);
  const newMax  = (maxValue * 1.15  )
  const options = {
    responsive: true,
    indexAxis: 'y', // This makes the bar chart horizontal
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'black',
          font: {
            size: 14,
          },
        },
        onClick: null, // Disable the ability to click on the legend to hide/show datasets
      },
      datalabels: {
        anchor: "end",
        align: chartData.length ===  "end",
        color: 'black',
        font: {
          weight: 'bold',
        },
        formatter: (value) => {
          return value;
        },
      },
    },
    layout: {
      padding: {
        top: 10,
        left: 10,
        right: 15,
        bottom: 10,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: true, // Show or hide x-axis grid lines if needed
        },
        suggestedMax:newMax
      },
      y: {
        grid: {
          display: false, // Show or hide y-axis grid lines if needed
        },
      },
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    animation: {
      duration: 500,
    },
  };


  return (
    <div className="py-3 w-full ">
      <h1 className="section-title text-xl font-bold text-red-700 mb-4">
        <span className="section-title-overlay font-bold">
          Production vs Defects
        </span>
      </h1>

      <div className="flex gap-4 w-full border-2 rounded-lg p-3  overflow-hidden ">
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


        <div className="w-9/12 h-full">

  {
    chartData && chartData.length > 0 ? (
      
      <div
        style={{
          width: "100%",
          height: "500px", 
          maxHeight: "100%", 
          overflowY: chartData?.length >= 13 ? "auto" : "none", 
          overflowX:"auto",
          background:"#fff",
          borderRadius:"10px"
        }}
      >
{
  textActive ?
<div className="p-2 font-semibold text-center">Only the machine or date filter you select will impact this graph</div>
: null
}

        
        <div
          style={{
            height: chartData?.length * 60 + "px", 
            minHeight: "90%", 
            width: "100%", 
            display: "flex", 
            justifyContent: "flex-start", 
            flexDirection: "column", 
            overflowX:"auto",

          }}
        >


          <Bar data={data} options={options}  />
        </div>
      </div>
    ) : (

      <div className="flex justify-center items-center font-extrabold h-52 w-full bg-white">
       {!loading ? "NO DATA" : <Spin />}
      </div>
    )
  }
</div>

      </div>
    </div>
  );
};
ProductAndDefect.propTypes = {
  chartData: PropTypes.any,
};


export default ProductAndDefect;