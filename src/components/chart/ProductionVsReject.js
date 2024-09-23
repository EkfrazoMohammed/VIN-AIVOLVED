import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import { API, AuthToken, baseURL } from "../../API/API";

function ProductionVsReject({ data }) {
  const { Title } = Typography;

  // Check if data is valid
  if (!data || Object.keys(data).length === 0) {
    return <div style={{ fontWeight: "700", textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>NO DATA</div>; // or some other fallback UI
  }

  // Process data to create series for bar chart
  const categories = data.map(item => item.date);
  const series = [

    {
      name: 'Total Production',
      data: data.map(item => parseInt(item.total_production, 10) || 0),
      color: '#52c41a' // Green color for production
    },
    {
      name: 'Total Defects',
      data: data.map(item => item.total_defects),
      color: '#FF0000' // Red color for defects
    }
  ];

  const chartData = {
    series: series,

    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        }
      },
      //   legend: {
      //     show: true,
      //     showForSingleSeries: false,
      //     showForNullSeries: true,
      //     showForZeroSeries: true,
      //     position: 'bottom',
      //     horizontalAlign: 'center', 
      //     floating: true,
      //     fontSize: '16px',
      //     fontFamily: 'Helvetica, Arial',
      //     fontWeight: 600,
      //     formatter: undefined,
      //     inverseOrder: false,
      //     // width: '16px',
      //     // height: "500px",
      //     tooltipHoverFormatter: undefined,
      //     customLegendItems: [],
      //     offsetX: 0,
      //     offsetY: 0,
      //     labels: {
      //         colors: undefined,
      //         useSeriesColors: false
      //     },
      //     markers: {
      //         size: 2,
      //         shape: 'line', // circle, square, line, plus, cross
      //         strokeWidth: 0,
      //         // fillColors: ["#000","#e5050"],
      //         radius: 6,
      //         // customHTML: function() {
      //         //   return '<span class="custom-marker">hhh</span>'
      //         // },        
      //             onClick: undefined,
      //         offsetX: 0,
      //         offsetY: 0
      //     },
      //     itemMargin: {
      //         horizontal: 5,
      //         vertical: 0
      //     },
      //     onItemClick: {
      //         toggleDataSeries: true
      //     },
      //     onItemHover: {
      //         highlightDataSeries: true
      //     },
      // },
      plotOptions: {
        bar: {
          horizontal: true,
          columnWidth: '55%',
          // endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: categories,
      },

      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          }
        }
      }
    },
  };

  return (
    <div className="barchart">
      <div>
        <Title level={5}>Production vs Defects</Title>
      </div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
        width={"100%"}

      />
    </div>
  );
}

export default ProductionVsReject;
