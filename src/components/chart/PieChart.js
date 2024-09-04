import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../API/API";
import LoaderIcon from "../LoaderIcon";
import {setSelectedDefectReports} from "./../../redux/slices/defectSlice"

import {updatePage } from "./../../redux/slices/reportSlice";
import { useSelector, useDispatch } from "react-redux";

function PieChart({ data, selectedDate }) {
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  const [chartData, setChartData] = useState({ labels: [], series: [] });
  // const [defectData, setDefectData] = useState([]);
  const defectsData = useSelector((state) => state.defect.defectsData)

  // useEffect(() => {
  //   axios
  //     .get(`${baseURL}defect/`, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     })
  //     .then((response) => {
  //       setDefectData(response.data.results);
  //       const colors = {};
  //       response.data.results.forEach((defect) => {
  //         colors[defect.name] = defect.color_code;
  //       });
  //       setDefectColors(colors);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching defect colors:", error);
  //     });
  // }, [accessToken]);

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
  if (!chartData || !chartData.labels || !chartData.series) {
    return <div>Loading chart...</div>;
  }
  return (
    <div>
      <div>
        <Title level={5} className="text-left semibold">
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

                if (clickedIndex === -1 || !chartData.labels[clickedIndex]) {
                  console.error("Invalid data point selected");
                  return;
                }

                const clickedLabel = chartData.labels[clickedIndex];
                // const clickedVal = defectsData.filter(
                //   (val) => val.name === clickedLabel
                // );
                const filterActive = true
                // dispatch(setSelectedDefectReports(clickedVal[0]))
                // console.log('dispatch called',clickedVal)
                const clickedVal = defectsData.filter(
                  (val) => val.name === clickedLabel
                );
                if (clickedVal.length > 0) {
                  dispatch(setSelectedDefectReports(clickedVal[0]?.id));
                  dispatch(updatePage({
                    current: 1,
                    pageSize: 10
                  }))
                  setTimeout(() => {
                    navigate(`/reports`, { state: { filterActive } });
                    // navigate(`/reports`);
                  }, [500])
                } else {
                  console.error("No matching defect found");
                }
              },
            },
          },
          colors: chartData.labels.map((label, index) => {
            const predefinedColors = ["#FF5733", "#e31f09", "#3357FF"];
            return (
              defectColors[label] ||
              predefinedColors[index % predefinedColors.length]
            );
          }),
          labels: chartData.labels,
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "14px",
            markers: {
              width: 10,
              height: 10,
              radius: 12,
            },
          },
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
