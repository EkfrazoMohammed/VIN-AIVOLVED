import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import LoaderIcon from "../LoaderIcon";
import { setSelectedDefectReports } from "./../../redux/slices/defectSlice"
import { updatePage } from "./../../redux/slices/reportSlice";
import { useSelector, useDispatch } from "react-redux";

function PieChart({ data, selectedDate, loading }) {
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  const [chartData, setChartData] = useState({ labels: [], series: [] });
  const defectsData = useSelector((state) => state.defect.defectsData)


  useEffect(() => {
    const colors = {};
    defectsData.forEach((defect) => {
      colors[defect.name] = defect.color_code;
    });
    setDefectColors(colors);
  }, [accessToken]);

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

  if (loading && Object.keys(data).length === 0) {
    return <div className="flex items-center justify-center w-full h-full font-bold ">Loading...</div>;

  }

  if (!data || Object.keys(data).length === 0) {
    return <div className="flex items-center justify-center w-full  font-extrabold h-52 ">NO DATA</div>;
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
                  return;
                }

                const clickedLabel = chartData.labels[clickedIndex];
                const filterActive = true
                const clickedVal = defectsData.filter(
                  (val) => val.name == clickedLabel
                );
                if (clickedVal.length > 0) {
                  dispatch(setSelectedDefectReports(clickedVal[0]?.id));
                  dispatch(updatePage({
                    current: 1,
                    pageSize: 10
                  }))
                  setTimeout(() => {
                    navigate(`/reports`, { state: { filterActive } });
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

          dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val.toFixed(2) + "%";
            },

            style: {
              fontSize: '12px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 'bold',
            }
          },
          labels: chartData.labels,
          legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "14px",
            fontWeight: "bold",
            markers: {
              width: 10,
              height: 10,
              radius: 12,
            },
            onItemHover: {
              highlightDataSeries: false
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
