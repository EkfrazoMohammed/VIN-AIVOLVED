import React from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";

function ProductionVsReject({ data }) {

  const { Title } = Typography;
  if (!data || Object.keys(data).length === 0) {
    return <div style={{ fontWeight: "700", textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      NO DATA
    </div>;
  }

  const categories = data.map(item => item.date);
  const series = [

    {
      name: 'Total Production',
      data: data.map(item => parseInt(item.total_production, 10) || 0),
      color: '#52c41a'
    },
    {
      name: 'Total Defects',
      data: data.map(item => item.total_defects),
      color: '#FF0000'
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
