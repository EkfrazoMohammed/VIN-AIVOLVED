import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { setSelectedDefectReports } from "./../../redux/slices/defectSlice"
import { updatePage } from "./../../redux/slices/reportSlice";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";

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

  // if (!data || Object.keys(data).length === 0) {
  //   return <div className="flex items-center justify-center w-full  font-extrabold h-52 ">NO DATA</div>;
  // }
  if (!chartData?.labels || !chartData?.series) {
    return <div>Loading chart...</div>;
  }
  return (
    <div>
      <div>
        <Title level={5} className="text-left semibold">
          {selectedDate
            ? `Pie Chart from ${selectedDate[0]}  to  ${selectedDate[1]}`
            : "Defect Distribution Analysis (Last 7 Days)"}
        </Title>
      </div>
      {
        !data || Object.keys(data).length === 0 ?
          <div className="flex items-center justify-center w-full h-48 font-bold  ">NO DATA</div> :
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
                  colors: ["#000"],
                  textShadow: "none",
                },
                dropShadow: {
                  enabled: false, // Ensures no shadow covers the text
                },

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
              plotOptions: {
                pie: {
                  dataLabels: {
                    offset: 0,  // Adjust this value to avoid text getting cut off or hidden

                  }
                }
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
      }

    </div>
  );
}
PieChart.propTypes = {
data:PropTypes.any,
selectedDate:PropTypes.any,
loading:PropTypes.any
};
export default PieChart;
