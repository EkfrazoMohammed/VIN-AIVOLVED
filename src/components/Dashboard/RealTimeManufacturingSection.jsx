import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import SelectComponent from "../common/Select";
import { dpmuFilterData, initialDpmuData } from "../../services/dashboardApi";
import useApiInterceptor from "../../hooks/useInterceptor";
import { setSelectedMachineDpmu } from "../../redux/slices/machineSlice";
import { useDispatch } from "react-redux";
export default function RealTimeManufacturingSection({
  loading,
  categoryDefects,
  productionData,
  selectedMachineDpmu,
  machines,
  machineChangeAction,
  accessToken,
  plant_id,
}) {

  const apiCallInterceptor = useApiInterceptor();
  const [filterDpmu, setfilterDpmu] = useState(false);
  const dispatch = useDispatch()


  const data = {
    labels: productionData?.map((item) => item.date_time),
    datasets: [
      {
        label: "date_time",
        data: productionData?.map((item) => parseInt(item.defect_percentage, 10)),
        backgroundColor: "#fae152",
      },
    ],
  };



  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw}M`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}M`,
        },
      },
    },
  };

  const handleDpmuFilter = () => {
    setfilterDpmu(true)
    dpmuFilterData(accessToken, apiCallInterceptor, selectedMachineDpmu)
  }

  const resetFilterDpmu = () => {
    setfilterDpmu(false)
    initialDpmuData(plant_id, accessToken, apiCallInterceptor);
    dispatch(setSelectedMachineDpmu(null));
  }

  useEffect(() => {
    dispatch(setSelectedMachineDpmu(null));
  }, [])



  return (
    <div className="py-4 px-0 ">
      <h1 className="section-title  text-red-700 mb-4">
        <span className="section-title-overlay font-bold" > Real-Time Manufacturing DPMU</span>
      </h1>
      <div className="flex mb-4">
        <div className="flex-grow mr-4 min-w-52 max-w-96">
          <div className="p-3  mb-2 border-2 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Total Defects</span>
            </div>

            <div className="text-4xl font-semibold text-red-500">
              {Object.values(categoryDefects).reduce(
                (total, category) => total + category,
                0
              )}
            </div>
          </div>
          <div className="p-2  border-2 rounded-md max-h-[350px] overflow-auto">
            <h2 className="text-lg  mb-2 font-semibold">Defects by types</h2>
            <ul>
              {loading || !categoryDefects ? (
                <li className="flex justify-center p-2">
                  <span className="max-w-28 text-wrap font-bold text-gray-500">
                    Loading...
                  </span>
                </li>
              ) : (
                Object.keys(categoryDefects).map((category, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-[#ff676e] p-2 mb-2 rounded"
                  >
                    <span className="max-w-32 text-wrap font-bold text-white break-words">
                      {category}
                    </span>
                    <span className="text-white font-bold">
                      {categoryDefects[category]}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="flex-grow">
          <div className="flex gap-3 py-3 ]">

            <SelectComponent placeholder={"Select Machine"} selectedData={selectedMachineDpmu} action={(val) =>
              machineChangeAction(val)} data={machines} style={{ minWidth: "150px", zIndex: 1 }} size={"large"} />
            <div
              type="primary"
              onClick={handleDpmuFilter}
              className=" bg-red-500 text-white rounded flex items-center justify-center py-2 px-3 cursor-pointer font-bold"
            >
              Apply filters
            </div>
            {
              filterDpmu ?
                <div
                  type="primary"
                  onClick={resetFilterDpmu}
                  className=" bg-red-500 text-white rounded flex items-center justify-center py-2 px-3 cursor-pointer font-bold"
                >
                  Reset Filter
                </div>
                : null
            }
          </div>
          {
            productionData?.length > 0 ?
              <Bar data={data} options={options} /> :
              <div className="flex justify-center items-center font-extrabold h-52 ">NO DATA</div>
          }
        </div>
      </div>
    </div>
  );
}
