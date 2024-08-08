import React, { useState, useEffect } from "react";
import ProductAndDefect from "./ProductAndDefect";
import DefectsReport from "./DefectsReport";
import TotalOverview from "./TotalOverview";
import MachineDataOverview from "./MachineDataOverview";
import RealTimeManufacturingSection from "./RealTimeManufacturingSection";

import {
  VideoCameraOutlined,
  BugOutlined,
  AlertOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Select } from "antd";
import { IoFilterSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import { API, baseURL, AuthToken, localPlantData } from "../../API/API";

const { RangePicker } = DatePicker;

const formatDate = (date) => date.toISOString().slice(0, 10);

const getInitialDateRange = () => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const formattedStartDate = formatDate(startDate);

  const endDate = new Date();
  const formattedEndDate = formatDate(endDate);

  return [formattedStartDate, formattedEndDate];
};

// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// ChartJS.register(
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Title,
//   Tooltip,
//   Legend
// );

const DashboardContentLayout = () => {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineOptions, setMachineOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOptions, setProductOptions] = useState([]);
  const [alertData, setAlertData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [activeProd, setActiveProd] = useState([]);
  const [productionData, setProductionData] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loaderData, setLoaderData] = useState(false);
  const [dateRange, setDateRange] = useState(getInitialDateRange());

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dateStrings) {
      setSelectedDate(dateStrings);
      setDateRange(dateStrings);
    } else {
      console.error("Invalid date range:", dates, dateStrings);
    }
  };

  const handleMachineChange = (value) => setSelectedMachine(value);
  const handleProductChange = (value) => setSelectedProduct(value);

  const fetchData = async (url, setData) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${AuthToken}`,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleApplyFilters = async () => {
    setLoaderData(true);
    const [fromDate, toDate] = dateRange;
    const queryParams = {
      plant_id: localPlantData.id,
      from_date: fromDate,
      to_date: toDate,
      machine_id: selectedMachine,
      department_id: selectedDepartment,
      product_id: selectedProduct,
      defect_id: selectedDefect,
    };
    const filteredQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    const queryString = new URLSearchParams(filteredQueryParams).toString();
    const url = `${baseURL}dashboard/?${queryString}`;

    fetchData(url, (data) => {
      setLoaderData(false);
      const { active_products, ...filterData } = data;
      setTableData(filterData);
      setActiveProd(active_products);
      setFilterActive(true);
    });
  };

  const resetFilter = () => {
    setFilterActive(false);
    setSelectedMachine(null);
    setSelectedProduct(null);
    setSelectedDate(null);
    setDateRange(getInitialDateRange());
    initialTableData();
    initialProductionData();
  };

  const initialTableData = async () => {
    setLoaderData(true);
    const url = `${baseURL}dashboard/?plant_id=${localPlantData.id}`;
    fetchData(url, (data) => {
      setLoaderData(false);
      const { active_products, ...datesData } = data;
      setTableData(datesData);
      setActiveProd(active_products);
    });
  };

  const initialProductionData = async () => {
    const url = `${baseURL}defct-vs-machine/?plant_id=${localPlantData.id}`;
    fetchData(url, (data) => {
      setProductionData(data.data_last_7_days);
    });
  };

  useEffect(() => {
    const fetchMachines = async () => {
      const url = `${baseURL}machine/?plant_name=${localPlantData.plant_name}`;
      fetchData(url, (data) => {
        const formattedMachines = data.results.map((machine) => ({
          id: machine.id,
          name: machine.name,
        }));
        setMachineOptions(formattedMachines);
      });
    };

    const fetchProducts = async () => {
      const url = `${baseURL}product/?plant_name=${localPlantData.plant_name}`;
      fetchData(url, (data) => {
        setProductOptions(data.results);
        setAlertData(data.results);
      });
    };

    fetchMachines();
    fetchProducts();
    initialTableData();
    initialProductionData();
  }, []);

  return (
    <>
      <div className="dx-row flex border-b-2 p-4 gap-3">
        <TotalOverview />
        {/* <MachineDataOverview /> */}
        <div className="overview-container w-9/12 h-[257px] bg-no-repeat flex flex-col justify-between p-3 rounded-md border-2">
          <div className="filter-lg-w">
            <div className="inner-w">
              <div className="flex items-center space-x-4 mb-4 h-[40px]">
                <button className="p-2 bg-gray-200 rounded h-full w-[40px] flex justify-center items-center">
                  <IoFilterSharp />
                </button>
                <Select
                  className="dx-default-select select-machines"
                  showSearch
                  placeholder="Select Machine"
                  value={selectedMachine}
                  onChange={handleMachineChange}
                  filterOption={(input, machineOptions) =>
                    (machineOptions?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {machineOptions.map((machine) => (
                    <Select.Option key={machine.id} value={machine.id}>
                      {machine.name}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  className="dx-default-select"
                  showSearch
                  placeholder="Select Products"
                  onChange={handleProductChange}
                  value={selectedProduct}
                  filterOption={(input, productOptions) =>
                    (productOptions?.children ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {productOptions.map((department) => (
                    <Select.Option key={department.id} value={department.id}>
                      {department.name}
                    </Select.Option>
                  ))}
                </Select>

                <RangePicker
                  className="dx-default-date-range"
                  style={{ marginRight: "10px", minWidth: "280px" }}
                  onChange={handleDateRangeChange}
                  allowClear={false}
                  inputReadOnly
                  value={
                    selectedDate
                      ? [
                          dayjs(selectedDate[0], "YYYY/MM/DD"),
                          dayjs(selectedDate[1], "YYYY/MM/DD"),
                        ]
                      : []
                  }
                />
                <Button
                  type="primary"
                  onClick={handleApplyFilters}
                  className="p-2 bg-red-500 text-white rounded flex items-center justify-center"
                >
                  Apply filters
                </Button>
                {filterActive && (
                  <Button
                    type="primary"
                    onClick={resetFilter}
                    className="p-2 bg-red-500 text-white rounded flex items-center justify-center"
                  >
                    Reset Filter
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4 h-[150px]">
                <div className="p-4 bg-white rounded-xl text-left">
                  <div className="flex justify-between items-center">
                    <span>Active Machines</span>
                    <VideoCameraOutlined />
                  </div>
                  <div className="text-[40px] text-gray-600 font-bold ">40</div>
                </div>
                <div className="p-4 bg-white rounded-xl text-left">
                  <div className="flex justify-between items-center">
                    <span>Defect Classification</span>
                    <BugOutlined />
                  </div>
                  <div className="text-[40px] text-gray-600 font-bold">5</div>
                </div>
                <div className="p-4 bg-white rounded-xl text-left">
                  <div className="flex justify-between items-center">
                    <span>No. of SKU</span>
                    <AlertOutlined />
                  </div>
                  <div className="text-[40px] text-gray-600 font-bold">50</div>
                </div>
                <Link className="p-4 bg-white rounded-xl text-left group hover:text-white hover:!bg-red-500">
                  <div className="flex justify-between items-center">
                    <span>Insights</span>
                    <NotificationOutlined />
                  </div>
                  <div className="text-[40px] text-gray-600 font-bold group-hover:text-white">
                    0
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RealTimeManufacturingSection />
      <div className="production-defect-report-container flex">
        <ProductAndDefect />
        <DefectsReport />
      </div>
    </>
  );
};

export default DashboardContentLayout;
