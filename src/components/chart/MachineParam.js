import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";

function MachineParam() {
  const { Title } = Typography;
  const [totalData, setTotalData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/params_graph/");
        if (res.data.length > 0) {
          const modifiedData = res.data.map(item => ({
            ...item,
            date_time: item.date_time.split('T')[0]
          }));
          setTotalData(modifiedData);
        }
      } catch (error) {
        console.error("Error fetching machine parameters:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (totalData.length === 0) return; // Check if totalData is empty
    const groupedData = {};
    totalData.forEach(item => {
      const date = item.date_time;
      if (!groupedData[date]) {
        groupedData[date] = {};
      }
      if (!groupedData[date][item.parameter]) {
        groupedData[date][item.parameter] = 0;
      }
      groupedData[date][item.parameter] += parseInt(item.params_count);
    });

    const categories = Object.keys(groupedData);
    const allParameters = new Set(totalData.map(item => item.parameter));
    const seriesData = Array.from(allParameters).map(parameter => {
      return {
        name: parameter,
        data: categories.map(date => groupedData[date][parameter] || 0),
        color: totalData.find(item => item.parameter === parameter).color_code
      };
    }).filter(series => series.data.some(count => count > 0)); // Remove series with count 0 for all dates

    setChartSeries(seriesData);

    const chartOptions = {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        }
      },
      xaxis: {
        categories: categories,
      },
      legend: {
        position: 'bottom',
        offsetY: '0'
      },
      fill: {
        opacity: 1
      }
    };
    setChartOptions(chartOptions);
  }, [totalData]);

  return (
    <div>
      <div>
        <Title level={5}>Production Vs Scanned Vs Rejected</Title>
      </div>
      <ReactApexChart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default MachineParam;
