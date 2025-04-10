import React, { useState, useEffect , useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography , Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { setSelectedDefectReports } from "./../../redux/slices/defectSlice"
import { updatePage } from "./../../redux/slices/reportSlice";
import { useSelector, useDispatch , shallowEqual } from "react-redux";
import PropTypes from "prop-types";

function PieChart({ data,  dateRange, loading, localPlantData }) {
 
  const reportStatusData = useSelector((state) => state.user.userData[0].permissions.generalRoutes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Title } = Typography;

  const defectsData = useSelector((state) => state.defect.defectsData, shallowEqual);
  const [defectColors, setDefectColors] = useState({});
  const [chartData, setChartData] = useState({ labels: [], series: [] });
  const [isDataReady, setIsDataReady] = useState(false);

  const reportStatus = reportStatusData.find((item) => item.name === "Reports")?.isActive;
  // Memoizing defect colors to avoid recalculating on every render
  useEffect(() => {
    if (defectsData && defectsData.length > 0) {
      const colors = {};
      defectsData.forEach((defect) => {
        colors[defect.name] = defect.color_code;
      });
      setDefectColors(colors);
      setIsDataReady(true);
    }
  }, [defectsData]);

  // Memoized chart data processing to avoid recalculating on every render
  const aggregatedData = useMemo(() => {
    if (!data || typeof data !== "object") return { labels: [], series: [] };

    return Object.values(data).reduce((acc, defects) => {
      Object.entries(defects).forEach(([defect, count]) => {
        if (!acc[defect]) {
          acc[defect] = 0;
        }
        acc[defect] += count;
      });
      return acc;
    }, {});
  }, [data]);

  const chartDataMemo = useMemo(() => ({
    labels: Object.keys(aggregatedData),
    series: Object.values(aggregatedData),
  }), [aggregatedData]);

  useEffect(() => {
    setChartData(chartDataMemo);
  }, [chartDataMemo]);

  // Loading state
  if (loading && Object.keys(data).length === 0) {
    return <div className="flex items-center justify-center w-full h-full font-bold"><Spin tip="Loading" size="medium"  /></div>;
  }

  // If chart data is not yet processed, show "loading chart" state
  if (!chartData?.labels || !chartData?.series) {
    return <div>Loading chart...</div>;
  }

  // Pie chart rendering
  return (
    <div className="w-full flex flex-col justify-between">
      <div>
        <Title level={5} className="text-center semibold">
       Pie Chart from {dateRange[0]} to {dateRange[1]}
           
        </Title>
      </div>

      <div className="w-full flex justify-center">
        {!isDataReady ? (
          <div className="flex items-center justify-center w-full h-48">
            <Spin size="large" />
          </div>
        ) : Object.keys(data).length === 0 ? (
          <div className="flex items-center justify-center w-full h-48 font-bold">
            NO DATA
          </div>
        ) : (
          <div style={{ width: "100%"  }}>
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
                      const filterActive = true;
                      const clickedVal = defectsData.filter((val) => val.name === clickedLabel);
                      if (clickedVal.length > 0 &&  reportStatus) {
                        setTimeout(() => {
                          navigate(`/reports`, { state:  clickedVal[0]?.id  });
                        }, 500);
                      } else {
                        console.error("No matching defect found");
                      }
                    },
                  },
                },
                colors: chartData.labels.map((label, index) => {
                  const predefinedColors = ["#FF5733", "#e31f09", "#3357FF"];
                  return defectColors[label] || predefinedColors[index % predefinedColors.length];
                }),
                dataLabels: {
                  enabled: true,
                  formatter: (val) => val.toFixed(2) + "%",
                  style: {
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 'bold',
                    colors: ["#000"],
                    textShadow: "none",
                  },
                  dropShadow: {
                    enabled: false,
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
                    highlightDataSeries: false,
                  },
                },
             
                plotOptions: {
                  pie: {
                    dataLabels: {
                      offset: 0,
                    },
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
              height={chartData.series.length > 15 ? 600 : 400}
            />
          </div>
        )}
      </div>
    </div>
  );
}
PieChart.propTypes = {
data:PropTypes.any,
selectedDate:PropTypes.any,
loading:PropTypes.any
};
export default PieChart;
