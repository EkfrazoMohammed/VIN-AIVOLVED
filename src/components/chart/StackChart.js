import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import axios from "axios";
import { baseURL } from "../../API/API";
import LoaderIcon from "../LoaderIcon";
import { useSelector } from "react-redux";

function StackChart({ data }) {
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const { Title } = Typography;
  const [defectColors, setDefectColors] = useState({});
  const [visibleSeries, setVisibleSeries] = useState({});

  useEffect(() => {
    axios
      .get(`${baseURL}defect/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const colors = {};
        response.data.results.forEach((defect) => {
          colors[defect.name] = defect.color_code;
        });
        setDefectColors(colors);
      })
      .catch((error) => {
        //console.error("Error fetching defect colors:", error);
      });
  }, [accessToken]);

  const defectNames = [
    ...new Set(Object.values(data).flatMap((defects) => Object.keys(defects))),
  ];
  const sortedDates = Object.keys(data).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  // Initialize visibleSeries state to show all series initially
  useEffect(() => {
    const initialVisibility = defectNames.reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {});
    setVisibleSeries(initialVisibility);
  }, [defectNames]);


  const seriesData = defectNames
    .filter((defectName) => visibleSeries[defectName]) // Only include visible series
    .map((defectName, index) => {
      return {
        name: defectName,
        data: sortedDates.map((date) => data[date][defectName] || 0),
        color:
          defectColors[defectName] ||
          ["#FF5733", "#e31f09", "#3357FF"][index % 3],
      };
    });


  const chartData = {
    series: seriesData,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
        animations: {
          enabled: false,
        },
      },
      xaxis: {
        type: "category",
        categories: sortedDates,
        labels: {
          rotate: -45,
          style: {
            fontSize: "12px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },
      yaxis: {
        min: 0,
        labels: {
          style: {
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },
      legend: {
        show: false, // Hide the default legend
      },
      fill: {
        opacity: 1,
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
    },
  };

  const handleCheckboxChange = (defectName) => {
    setVisibleSeries((prev) => ({
      ...prev,
      [defectName]: !prev[defectName],
    }));
  };

  if (!data || Object.keys(data).length === 0) {
    return <LoaderIcon text={"Loading..."} />;
  }

  return (
    <div>
      <div>
        <Title level={5} className="text-left font-semibold">
          Bar Graph for Defects
        </Title>
      </div>

      {/* Custom legend with checkboxes */}
      <div>
        {defectNames.map((defectName) => (
          <label key={defectName} style={{ marginRight: "10px" }}>
            <input
              type="checkbox"
              checked={visibleSeries[defectName]} // Controlled by state
              onChange={() => handleCheckboxChange(defectName)}
            />
            {defectName}
          </label>
        ))}
      </div>

      {/* ApexChart */}
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default StackChart;
