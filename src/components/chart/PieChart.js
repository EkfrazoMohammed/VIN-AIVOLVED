import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthToken, baseURL } from "../../API/API";
import LoaderIcon from "../LoaderIcon";

function PieChart({ data, selectedDate }) {
  const navigate = useNavigate();
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  const [chartData, setChartData] = useState({ labels: [], series: [] });
  const [defectData, setDefectData] = useState([]);

  useEffect(() => {
    // Fetch defect colors from the API
    axios
      .get(`${baseURL}defect/`, {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      })
      .then((response) => {
        setDefectData(response.data.results);
        const colors = {};
        response.data.results.forEach((defect) => {
          colors[defect.name] = defect.color_code;
        });
        setDefectColors(colors);
      })
      .catch((error) => {
        console.error("Error fetching defect colors:", error);
      });
  }, []);

  useEffect(() => {
    if (!data || typeof data !== "object") return;

    const aggregatedData = Object.values(data).reduce((acc, defects) => {
      Object.entries(defects).forEach(([defect, count]) => {
        if (!acc[defect]) {
          acc[defect] = 0;
        }
        acc[defect] += count;
      });
      return acc;
    }, {});

    const labels = Object.keys(aggregatedData);
    const series = Object.values(aggregatedData);

    setChartData({ labels, series });
  }, [data]);

  if (!data || Object.keys(data).length === 0) {
    return <LoaderIcon text={"Loading..."} />;
  }

  let clickedVal;
  return (
    <div>
      <div>
        <Title level={5} className="text-left">
          {selectedDate
            ? `Pie Chart from ${selectedDate[0]}  to  ${selectedDate[1]}`
            : "Pie Chart for Defects (7 days)"}
        </Title>
      </div>
      <ReactApexChart
        options={{
          chart: {
            width: 380,
            type: "pie",
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                const clickedIndex = opts.dataPointIndex;
                const clickedLabel = chartData.labels[clickedIndex];
                clickedVal = defectData.filter(
                  (val) => val.name === clickedLabel
                );
              },
              click: (event, chartContext, opts) => {
                if (opts?.globals?.selectedDataPoints[0]?.length > 0) {
                  navigate(`/reports`, { state: { clickedVal } });
                }
              },
            },
          },
          colors: chartData.labels.map((label, index) => {
            const predefinedColors = [
              "#FF5733",
              "#3357FF",
              "#000080",
              "#00FFFF",
              "#FFFF00",
              "#33FF57",
              "#3357HF",
            ];
            return (
              defectColors[label] ||
              predefinedColors[index % predefinedColors.length]
            );
          }),
          labels: chartData.labels,
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
                markers: {
                  size: 6,
                  shape: undefined, // circle, square, line, plus, cross
                  strokeWidth: 2,
                  fillColors: undefined,
                  radius: 2,
                  customHTML: undefined,
                  onClick: function () {
                    return null;
                  },
                  offsetX: 0,
                  offsetY: 0,
                },
              },
            },
          ],
        }}
        series={chartData.series}
        type="pie"
        height={350}
      />
    </div>
  );
}

export default PieChart;
