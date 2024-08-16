import { useState, useEffect } from "react";
import ProductAndDefect from "./ProductAndDefect";
import DefectsReport from "./DefectsReport";
import TotalOverview from "./TotalOverview";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";

import { useSelector, useDispatch } from "react-redux";
import { initialDashboardData, getMachines, getSystemStatus, getDepartments, initialDpmuData, initialProductionData, getProducts } from "../../services/dashboardApi";
import DOMPurify from "dompurify";
import { setSelectedMachine } from "../../redux/slices/machineSlice"
import { setSelectedProduct } from "../../redux/slices/productSlice"
import { getDashboardSuccess, getDashboardFailure } from "../../redux/slices/dashboardSlice"
import { Link, useNavigate, useNavigation, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Card,
  notification,
  Space,
  Col,
  Row,
  Typography,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Dropdown,
  Menu,
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import {
  VideoCameraOutlined,
  BugOutlined,
  AlertOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import StackChart from "../../components/chart/StackChart";
import PieChart from "../../components/chart/PieChart";

// import MachineParam from "../../components/chart/MachineParam";

import ProductionVsReject from "../../components/chart/ProductionVsReject";
import { baseURL } from "../../API/API";
import dayjs from "dayjs";
import { Hourglass } from "react-loader-spinner";
import { IoFilterSharp } from "react-icons/io5";
import RealTimeManufacturingSection from "./RealTimeManufacturingSection";
import useApiInterceptor from "../../hooks/useInterceptor";
import axiosInstance from "../../API/axiosInstance";

const DashboardContentLayout = ({ children }) => {
  const apiCallInterceptor = useApiInterceptor();
  const dispatch = useDispatch();
  const localPlantData = useSelector((state) => state?.plant?.plantData[0]);

  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const machines = useSelector((state) => state.machine.machinesData)
  const activeMachines = useSelector((state) => state.machine.activeMachines)
  const dpmuChartData = useSelector((state) => state.dpmu.dpmuData)
  const productionVsDefectChartData = useSelector((state) => state.productVsDefect.productvsdefectData)
  const productsData = useSelector((state) => state.product.productsData)
  const selectedMachineRedux = useSelector((state) => state.machine.selectedMachine);
  const selectedProductRedux = useSelector((state) => state.product.selectedProduct);
  const tableDataRedux = useSelector((state) => state.dashboard.datesData);
  const tableDataReduxActive = useSelector((state) => state.dashboard.activeProducts)

  const [loading, setLoading] = useState(true);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const formattedStartDate = startDate.toISOString().slice(0, 10);
  const endDate = new Date();
  const formattedEndDate = endDate.toISOString().slice(0, 10);

  const [selectedDefect, setSelectedDefect] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState([
    formattedStartDate,
    formattedEndDate,
  ]);
  const [activeProd, setActiveProd] = useState([]);

  const currentUrlPath = useLocation();

  const handleMachineChange = (value) => {
    dispatch(setSelectedMachine(Number(value))); // Dispatching action    
  };

  const handleProductChange = (value) => {
    dispatch(setSelectedProduct(Number(value))); // Dispatching action    
  }



  // Handler for date range changes
  const handleDateRangeChange = (dates, dateStrings) => {
    // Ensure dates and dateStrings are valid before updating state
    if (Array.isArray(dateStrings) && dateStrings.length === 2) {
      setSelectedDate(dateStrings);
      setDateRange(dateStrings);
    } else {
      console.error("Invalid date range:", dates, dateStrings);
    }
  };
  useEffect(() => {
    console.log(localPlantData?.id)
    // window.location.reload()
  }, [localPlantData])
  const resetFilter = () => {
    initialDashboardData(localPlantData.id, accessToken, apiCallInterceptor);
    initialDpmuData(localPlantData.id, accessToken);
    initialProductionData(localPlantData.id, accessToken, apiCallInterceptor);
    dispatch(setSelectedMachine(null)); // Dispatching action
    dispatch(setSelectedProduct(null)); // Dispatching action
    setSelectedDate(null);
    setFilterActive(false);
  };

  const handleApplyFilters = () => {

    const domain = `${baseURL}`;
    const [fromDate, toDate] = dateRange; // Destructure the date range

    // Construct query parameters
    const queryParams = {
      plant_id: localPlantData.id, // Ensure localPlantData is valid
      from_date: fromDate,
      to_date: toDate,
      machine_id: selectedMachineRedux,
      product_id: selectedProductRedux,
      defect_id: selectedDefect,
    };

    // Filter out undefined or null values from query parameters
    const filteredQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    // Create the query string
    const queryString = new URLSearchParams(filteredQueryParams).toString();
    const url = `dashboard/?${queryString}`; // Complete URL with query string

    // Make the API call using axiosInstance
    apiCallInterceptor
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include authorization token
        },
      })
      .then((response) => {

        dispatch(getDashboardSuccess(response.data))
        setFilterActive(true);
      })
      .catch((error) => {
        console.error("Error:", error); // Log error

      });
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set loading to true
        setLoading(true);

        // Fetching data in parallel
        await Promise.all([

          getMachines(localPlantData.plant_name, accessToken, apiCallInterceptor),
          getDepartments(localPlantData.plant_name, accessToken, apiCallInterceptor),
          initialDpmuData(localPlantData.id, accessToken, apiCallInterceptor),
          getProducts(localPlantData.plant_name, accessToken, apiCallInterceptor),
          initialDateRange(),
          // initialTableData(),
          initialDashboardData(localPlantData.id, accessToken, apiCallInterceptor),
          initialProductionData(localPlantData.id, accessToken, apiCallInterceptor),

          getSystemStatus(localPlantData.id, accessToken, apiCallInterceptor),
        ]);
      } catch (err) {
        console.log(err.message || "Failed to fetch data")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initialDateRange = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago
    const formattedStartDate = startDate.toISOString().slice(0, 10);
    // Format startDate as YYYY-MM-DD

    const endDate = new Date(); // Today's date
    const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD

    setDateRange([formattedStartDate, formattedEndDate]);
  };

  const [filterActive, setFilterActive] = useState(false);



  const { Title } = Typography;
  const { RangePicker } = DatePicker;
  const [categoryDefects, setCategoryDefects] = useState([]);
  // Function to categorize defects
  const categorizeDefects = (data) => {
    const categories = {};
    Object.keys(data).forEach((date) => {
      const defects = data[date];
      Object.keys(defects).forEach((defect) => {
        if (!categories[defect]) {
          categories[defect] = 0;
        }
        categories[defect] += defects[defect];
      });
    });
    return categories;
  };

  useEffect(() => {
    const categorizedData = categorizeDefects(tableDataRedux);
    setCategoryDefects(categorizedData);
  }, [tableDataRedux]);

  const [selectedCheckboxMachine, setSelectedCheckboxMachine] = useState([]);
  const handleMachineCheckBoxChange = (checkedValues) => {
    setSelectedCheckboxMachine(checkedValues);
    let url = `${baseURL}/reports?machine=`;
    checkedValues.forEach((machineId, index) => {
      if (index !== 0) {
        url += ",";
      }
      url += `machine${machineId}`;
    });

    axios
      .get(url)
      .then((response) => {
        dispatch(getDashboardSuccess(response.data))
        // setTableData(response.data);
      })
      .catch((error) => {
        getDashboardFailure();
        console.error("Error fetching department data:", error);
      });
  };

  const menu = (
    <Menu selectable={true}>
      <Menu.Item key="0">
        <Checkbox.Group
          style={{ display: "block" }}
          value={selectedCheckboxMachine}
          onChange={handleMachineCheckBoxChange}
        >
          {activeMachines.map((machine) => (
            <div
              key={machine.id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              {machine.system_status ? (
                <p
                  style={{ fontSize: "1.1rem", width: "100%" }}
                  value={machine.id}
                >
                  {machine.machine_name}
                </p>
              ) : null}
            </div>
          ))}
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );
  const defectMenu = (
    <Menu>
      <Menu.Item key="0">
        <Checkbox.Group style={{ display: "block" }}>
          {Object.keys(categoryDefects).map((defect) => (
            <div
              key={defect.id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p style={{ fontSize: "1.1rem", width: "100%" }} value={defect}>
                {defect}
              </p>
            </div>
          ))}
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );
  const prodMenu = (
    <Menu>
      <Menu.Item key="0">
        <Checkbox.Group style={{ display: "block" }}>
          {Object.values(tableDataReduxActive).map((prod) => (
            <div
              key={prod.id}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <p style={{ fontSize: "1.1rem", width: "100%" }} value={prod}>
                {prod}
              </p>
            </div>
          ))}
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );
  const [notifications, setNotifications] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [prevNotificationLength, setPrevNotificationLength] = useState(0);
  const [api, contextHolder] = notification.useNotification();


  const close = () => {
    console.log("Notification was closed");
  };
  return (
    <>
      {children &&
        currentUrlPath.pathname !== "/" &&
        currentUrlPath.pathname !== "/dashboard-home" ? (
        children
      ) : (
        <>
          <div className="dx-row flex  pb-4 gap-3">
            <TotalOverview />
            <div className="overview-container w-9/12 h-[257px] flex flex-col justify-between p-3 rounded-md border-2">
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
                      value={selectedMachineRedux}
                      onChange={handleMachineChange}
                      filterOption={(input, machineOptions) =>
                        (machineOptions?.children ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {machines.map((machine) => (
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
                      value={selectedProductRedux}
                      filterOption={(input, productsData) =>
                        (productsData?.children ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {productsData.map((department) => (
                        <Select.Option
                          key={department.id}
                          value={department.id}
                        >
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
                    <div className=" bg-gray-100 rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>Active Machines</span>
                        <VideoCameraOutlined />
                      </div>
                      <Dropdown overlay={menu} trigger={["click"]} className="h-[70px] text-[35px] text-gray-500 font-semibold bg-gray-200 p-3">
                        <div className="number" style={{ cursor: "pointer" }}>
                          <div className=" flex items-center justify-between">
                            {activeMachines.length}
                            <IoIosArrowDown className="text-[18px]" />
                          </div>
                        </div>
                      </Dropdown>
                    </div>
                    <div className="bg-gray-100 rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>Defect Classification</span>
                        <BugOutlined />
                      </div>
                      <Dropdown overlay={defectMenu} trigger={["click"]} className="h-[70px] text-[35px] text-gray-500 font-semibold bg-gray-200 p-3">
                        <div className="number" style={{ cursor: "pointer" }}>
                          <div className="flex items-center justify-between">
                            {Object.keys(categoryDefects).length}
                            <IoIosArrowDown className="text-[18px]" />
                          </div>
                        </div>
                      </Dropdown>
                    </div>
                    <div className="bg-gray-100 rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>No. of SKU</span>
                        <AlertOutlined />
                      </div>
                      <Dropdown overlay={prodMenu} trigger={["click"]} className="h-[70px] text-[35px] text-gray-500 font-semibold bg-gray-200 p-3">
                        <div className="number" style={{ cursor: "pointer" }}>
                          <div className="flex items-center justify-between">
                            {Object.keys(tableDataReduxActive).length}
                            <IoIosArrowDown className="text-[18px]" />
                          </div>
                        </div>
                      </Dropdown>
                    </div>
                    <Link
                      to="/insights"
                      className={`relative bg-gray-100 rounded-xl text-left flex flex-col group hover:text-white hover:!bg-red-500 
                    ${notifications.length > prevNotificationLength
                          ? "notification-change"
                          : ""
                        }
                  `}
                    >
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>Insights</span>
                        <NotificationOutlined />
                      </div>
                      <IoMdArrowForward className="absolute bottom-5 right-5 text-lg" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <RealTimeManufacturingSection
            loading={loading}
            categoryDefects={categoryDefects}
            productionData={dpmuChartData}
          />
          <div className="production-defect-report-container flex">
            <ProductAndDefect loading={loading} chartData={productionVsDefectChartData} />
          </div>
          <DefectsReport
            loading={loading}
            chartData={tableDataRedux}
            chart1={<StackChart data={tableDataRedux} />}
            chart2={<PieChart data={tableDataRedux} selectedDate={selectedDate} />}
          />
        </>
      )}
    </>
  );
};

export default DashboardContentLayout;
