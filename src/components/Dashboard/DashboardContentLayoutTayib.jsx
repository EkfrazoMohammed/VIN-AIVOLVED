import { useState, useEffect } from "react";
import ProductAndDefect from "./ProductAndDefect";
import DefectsReport from "./DefectsReport";
import TotalOverview from "./TotalOverview";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
import DOMPurify from 'dompurify';
import { useSelector, useDispatch } from "react-redux";
import {
  Link,
  useNavigate,
  useNavigation,
  useLocation,
} from "react-router-dom";
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
import LineChart from "../../components/chart/LineChart";
import PieChart from "../../components/chart/PieChart";
import MachinesParameter from "../../pages/MachinesParameterWithPagination";
import MachinesParameterWithPagination from "../../pages/MachinesParameterWithPagination";
import MachineParam from "../../components/chart/MachineParam";
import { API, baseURL, AuthToken, localPlantData } from "../../API/API";
import ProductionVsReject from "../../components/chart/ProductionVsReject";
import dayjs from "dayjs";
import { Hourglass } from "react-loader-spinner";
import { IoFilterSharp } from "react-icons/io5";
import RealTimeManufacturingSection from "./RealTimeManufacturingSection";

import { useFetchMachines, useFetchProducts, useFetchDefects, useFetchDashboardData, useFetchDefectVsMachineData } from '../../services/apiCalls';
const DashboardContentLayout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const formattedStartDate = startDate.toISOString().slice(0, 10);
  const endDate = new Date();
  const formattedEndDate = endDate.toISOString().slice(0, 10);
  const dateFormat = "YYYY/MM/DD";

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loaderData, setLoaderData] = useState(false);
  const [dateRange, setDateRange] = useState([
    formattedStartDate,
    formattedEndDate,
  ]);
  const [tableData, setTableData] = useState([]);
  const [productionData, setProductionData] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [activeMachines, setActiveMachines] = useState([]);
  const [activeProd, setActiveProd] = useState([]);

  const [defectsData, setDefectsData] = useState([]);

  const [categoryDefects, setCategoryDefects] = useState([]);
  const [filterActive, setFilterActive] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [prevNotificationLength, setPrevNotificationLength] = useState(0);
  const [api, contextHolder] = notification.useNotification();
  const currentUrlPath = useLocation();

  const { Title } = Typography;
  const { RangePicker } = DatePicker;

  const localPlantData = useSelector((state) => state.plant.plantData);

  // Custom hooks
  const fetchMachines = useFetchMachines(localPlantData.plant_name);
  const fetchProducts = useFetchProducts(localPlantData.plant_name);
  const fetchDashboardData = useFetchDashboardData(localPlantData.id);
  const fetchDefectVsMachineData = useFetchDefectVsMachineData(localPlantData.id);
  const fetchDefects = useFetchDefects();
  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        const machines = await fetchMachines();
        setMachineOptions(machines);
        const products = await fetchProducts();
        setProductOptions(products);
        const dashboardData = await fetchDashboardData({ plant_id: localPlantData.id });
        setTableData(dashboardData);
        const productionData = await fetchDefectVsMachineData();
        setProductionData(productionData);
        const defects = await fetchDefects();
        setDefectsData(defects);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  useEffect(() => {
    const categorizedData = categorizeDefects(defectsData);
    setCategoryDefects(categorizedData);
  }, [defectsData]);

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
        console.log(response);
        // setTableData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching department data:", error);
      });
  };

  useEffect(() => {
    const initializeWebSocket = () => {
      const socket = new WebSocket(`wss://hul.aivolved.in/ws/notifications/${localPlantData.id}/`);

      socket.onopen = () => {
        console.log(`WebSocket connection established ${localPlantData.id}`);
        setIsSocketConnected(true);
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setNotifications((prevNotifications) => {
          const newNotifications = [...prevNotifications, message.notification];

          api.open({
            message: message.notification,
            duration: 5000,
            showProgress: true,
            pauseOnHover: true,
            key: `open${Date.now()}`,
            stack: 2,
            icon: <ExclamationCircleOutlined style={{ color: "#fff" }} />,
            style: { whiteSpace: "pre-line" },
            btn: (
              <Space>
                <Button
                  type="link"
                  size="small"
                  onClick={() => api.destroy(`open${Date.now()}`)}
                  style={{ color: "#fff" }}
                >
                  Close
                </Button>
                <Button
                  type="primary"
                  size="large"
                  style={{ fontSize: "1rem", backgroundColor: "#fff", color: "orangered" }}
                >
                  <Link to="/insights">View All Errors</Link>
                </Button>
              </Space>
            ),
          });

          return newNotifications;
        });
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        setIsSocketConnected(false);
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsSocketConnected(false);
      };

      return () => {
        socket.close();
      };
    };

    const cleanup = initializeWebSocket();
    return cleanup;
  }, [api, localPlantData.id]);

  const handleMachineChange = value => setSelectedMachine(value);
  const handleDepartmentChange = value => setSelectedDepartment(value);
  const handleProductChange = value => setSelectedProduct(value);
  const handleDateRangeChange = (dates, dateStrings) => setDateRange(dateStrings);
  const resetFilter = () => {


    // Reset selected filters in a single setState call
    setSelectedMachine(null);
    setSelectedProduct(null);
    setSelectedDate(null);

    // Reset filter active state
    setFilterActive(false);
  };
  const handleApplyFilters = async () => {
    setLoading(true);
    const queryParams = {
      plant_id: localPlantData.id,
      from_date: dateRange[0],
      to_date: dateRange[1],
      machine_id: selectedMachine,
      department_id: selectedDepartment,
      product_id: selectedProduct,
    };
    try {
      const data = await fetchDashboardData(queryParams)();
      setTableData(data);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setDateRange([dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
    setSelectedMachine(null);
    setSelectedDepartment(null);
    setSelectedProduct(null);
    handleApplyFilters();
  };

  const categorizeDefects = (data) => {
    return data.reduce((acc, item) => {
      const { category, defect } = item;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(defect);
      return acc;
    }, {});
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
          {Object.values(activeProd).map((prod) => (
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


  useEffect(() => {
    const initializeWebSocket = () => {
      const socket = new WebSocket(
        `wss://hul.aivolved.in/ws/notifications/${localPlantData.id}/`
      );
      socket.onopen = () => {
        console.log(`WebSocket connection established ${localPlantData.id}`);
        setIsSocketConnected(true); // Update connection status
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setNotifications((prevNotifications) => {
          const newNotifications = [...prevNotifications, message.notification];

          // Show notification using Ant Design
          const key = `open${Date.now()}`;
          api.open({
            message: message.notification,
            onClose: close,
            duration: 5000,
            showProgress: true,
            pauseOnHover: true,
            key,
            stack: 2,
            icon: (
              <ExclamationCircleOutlined
                style={{
                  color: "#fff",
                }}
              />
            ),
            style: { whiteSpace: "pre-line" }, // Added style for new line character
            btn: (
              <Space>
                <Button
                  type="link"
                  size="small"
                  onClick={() => api.destroy(key)}
                  style={{ color: "#fff" }}
                >
                  Close
                </Button>

                <Button
                  type="primary"
                  size="large"
                  style={{
                    fontSize: "1rem",
                    backgroundColor: "#fff",
                    color: "orangered",
                  }}
                  onClick={() => api.destroy()}
                >
                  <Link to="/insights">View All Errors </Link>
                </Button>
              </Space>
            ),
          });

          return newNotifications;
        });
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
        setIsSocketConnected(false); // Update connection status
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsSocketConnected(false); // Update connection status
      };

      return () => {
        socket.close();
      };
    };

    const cleanup = initializeWebSocket();
    return cleanup;
  }, [api]);


  const close = () => {
    console.log("Notification was closed");
  };
  return (
    <>
      {children && (currentUrlPath.pathname !== "/" && currentUrlPath.pathname !== "/dashboard-home") ? (
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
                    <div className="p-4 bg-gray-100 rounded-xl text-left">
                      <div className="flex justify-between items-center">
                        <span>Active Machines</span>
                        <VideoCameraOutlined />
                      </div>
                      <Dropdown overlay={menu} trigger={["click"]}>
                        <div className="number" style={{ cursor: "pointer" }}>
                          <div className="text-[35px] text-gray-500 font-semibold bg-white rounded mt-3 px-2 flex items-center justify-between">
                            {activeMachines.length}
                            <IoIosArrowDown className="text-[18px]" />
                          </div>
                        </div>
                      </Dropdown>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-xl text-left">
                      <div className="flex justify-between items-center">
                        <span>Defect Classification</span>
                        <BugOutlined />
                      </div>
                      <Dropdown overlay={defectMenu} trigger={["click"]}>
                        <div className="number" style={{ cursor: "pointer" }}>
                          <div className="text-[35px] text-gray-500 font-semibold bg-white rounded mt-3 px-2 flex items-center justify-between">
                            {Object.keys(categoryDefects).length}
                            <IoIosArrowDown className="text-[18px]" />
                          </div>
                        </div>
                      </Dropdown>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-xl text-left">
                      <div className="flex justify-between items-center">
                        <span>No. of SKU</span>
                        <AlertOutlined />
                      </div>
                      <Dropdown overlay={prodMenu} trigger={["click"]}>
                        <div className="number" style={{ cursor: "pointer" }}>
                          <div className="text-[35px] text-gray-500 font-semibold bg-white rounded mt-3 px-2 flex items-center justify-between">
                            {Object.keys(activeProd).length}
                            <IoIosArrowDown className="text-[18px]" />
                          </div>
                        </div>
                      </Dropdown>
                    </div>
                    <Link
                      to="/insights"
                      className={`relative p-4 bg-gray-100 rounded-xl text-left group hover:text-white hover:!bg-red-500 
                    ${notifications.length > prevNotificationLength
                          ? "notification-change"
                          : ""
                        }
                  `}
                    >
                      <div className="flex justify-between items-center">
                        <span>Insights</span>
                        <NotificationOutlined />
                      </div>
                      <div className="text-[40px] text-gray-600 font-bold group-hover:text-white">
                        0
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
            productionData={productionData}
          />
          <div className="production-defect-report-container flex">
            <ProductAndDefect loading={loading} chartData={productionData} />
          </div>
          <DefectsReport
            loading={loading}
            chartData={tableData}
            chart1={<StackChart data={tableData} />}
            chart2={<PieChart data={tableData} selectedDate={selectedDate} />}
          />
        </>
      )}
    </>
  );
};



export default DashboardContentLayout;