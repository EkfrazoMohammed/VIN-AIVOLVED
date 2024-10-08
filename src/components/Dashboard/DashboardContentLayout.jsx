import { useState, useEffect } from "react";
import ProductAndDefect from "./ProductAndDefect";
import DefectsReport from "./DefectsReport";
import TotalOverview from "./TotalOverview";
import { IoIosArrowDown } from "react-icons/io";
import { IoMdArrowForward } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { initialDashboardData, getMachines, getSystemStatus, getDepartments, initialDpmuData, initialProductionData, getProducts, getDefects, getRoles, dpmuFilterData, dpmuFilterDate } from "../../services/dashboardApi";
import { setSelectedMachine, setSelectedMachineDpmu } from "../../redux/slices/machineSlice"
import { setSelectedProduct } from "../../redux/slices/productSlice"
import { getDashboardSuccess, getDashboardFailure } from "../../redux/slices/dashboardSlice"
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { DatePicker, Checkbox, Dropdown, Menu } from "antd";
import { VideoCameraOutlined, BugOutlined, AlertOutlined, NotificationOutlined } from "@ant-design/icons";
import StackChart from "../../components/chart/StackChart";
import PieChart from "../../components/chart/PieChart";
import { baseURL } from "../../API/API";
import dayjs from "dayjs";
import RealTimeManufacturingSection from "./RealTimeManufacturingSection";
import useApiInterceptor from "../../hooks/useInterceptor";
import { encryptAES } from "../../redux/middleware/encryptPayloadUtils";
import SelectComponent from "../common/Select";
import { setSelectedShift } from "../../redux/slices/shiftSlice";
import { getProductVsDefectSuccess } from "../../redux/slices/productvsDefectSlice";
import { getDpmuSuccess } from "../../redux/slices/dpmuSlice";
import DropdownComponent from "../common/DropdownComponent";

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
  const shiftDataRedux = useSelector((state) => state.shift.shiftData)
  const selectedMachineRedux = useSelector((state) => state.machine.selectedMachine);
  const selectedMachineDpmu = useSelector((state) => state.machine.selectedMachineDpmu);

  const selectedProductRedux = useSelector((state) => state.product.selectedProduct);
  const selectedShiftRedux = useSelector((state) => state.shift.selectedShift)

  const tableDataRedux = useSelector((state) => state.dashboard.datesData);
  const tableDataReduxActive = useSelector((state) => state.dashboard.activeProducts)
  const [loading, setLoading] = useState(true);
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const formattedStartDate = startDate.toISOString().slice(0, 10);
  const endDate = new Date();
  const formattedEndDate = endDate.toISOString().slice(0, 10);
  const [filterActive, setFilterActive] = useState(false);
  const [filterChanged, setFilterChanged] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState([
    formattedStartDate,
    formattedEndDate,
  ]);
  const currentUrlPath = useLocation();
  const handleMachineChange = (value) => {
    setFilterActive(false)

    if (!value) {
      return dispatch(setSelectedMachine(null))
    }
    dispatch(setSelectedMachine(Number(value)));
    setFilterChanged(true)
  };


  const handleMachineChangeDpmu = (value) => {
    dispatch(setSelectedMachineDpmu(Number(value)));
  };


  const handleProductChange = (value) => {
    setFilterActive(false)
    if (!value) {
      return dispatch(setSelectedProduct(null))
    }
    dispatch(setSelectedProduct(Number(value)));
    setFilterChanged(true)
  }

  const handleShiftChange = (value) => {
    setFilterActive(false)
    if (!value) {
      return dispatch(setSelectedShift(null))
    }
    dispatch(setSelectedShift(value));
    setFilterChanged(true)
  }
  const handleDateRangeChange = (dates, dateStrings) => {
    if (Array.isArray(dateStrings) && dateStrings.length === 2) {
      setSelectedDate(dateStrings);
      setDateRange(dateStrings);
      setFilterChanged(true)
    } else {
      console.log("Invalid date range:", dates, dateStrings);
    }
  };
  useEffect(() => {
    resetFilter()
  }, [localPlantData])

  const resetFilter = () => {
    initialDashboardData(localPlantData.id, accessToken, apiCallInterceptor);
    initialDpmuData(localPlantData.id, accessToken, apiCallInterceptor);
    initialProductionData(localPlantData.id, accessToken, apiCallInterceptor)
    initialDateRange();
    dispatch(setSelectedMachine(null));
    dispatch(setSelectedProduct(null));
    dispatch(setSelectedShift(null))
    setSelectedDate(null);
    setFilterActive(false);
    setFilterChanged(false)
  };





  // FILTER DATA FROM BACKEND
  const handelFilterProduction = async () => {
    try {
      dpmuFilterData(apiCallInterceptor, selectedMachineRedux, localPlantData.id, dateRange, selectedDate)
      setLoading(true)
      const [fromDate, toDate] = dateRange;
      const queryParams = {
        plant_id: localPlantData.id,
        from_date: fromDate,
        to_date: toDate,
        machine_id: selectedMachineRedux
      };
      const filteredQueryParams = Object.fromEntries(
        Object.entries(queryParams).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );
      const encryptedUrl = Object.fromEntries(
        Object.entries(filteredQueryParams).map(([key, val]) => {
          if (key !== "page" && key !== "page_size") {
            if (key === "from_date" || key === "to_date") {
              return [key, encryptAES(val)];
            }
            return [key, encryptAES(JSON.stringify(val))];
          }
          return [key, val];
        })
      );
      const queryString = new URLSearchParams(encryptedUrl).toString();

      const defectUrl = `defct-vs-machine/?${queryString}`;
      // const ParamUrl = `params_graph/?${queryString}`;

      const [defectResponse, paramResponse] = await Promise.all([
        apiCallInterceptor.get(defectUrl),
        // apiCallInterceptor.get(ParamUrl)
      ])

      if (defectResponse) {
        setLoading(false)
      }

      dispatch(getProductVsDefectSuccess(defectResponse.data.data_last_7_days));
      // dispatch(getDpmuSuccess(paramResponse.data.results));

    } catch (error) {
      console.log("Error:", error);
      setLoading(false)
    }
  }


  const handleApplyFilters = () => {

    if (!selectedMachineRedux) {
      initialDpmuData(localPlantData.id, accessToken, apiCallInterceptor);
      initialProductionData(localPlantData.id, accessToken, apiCallInterceptor)
      setFilterActive(false)
    }

    if (selectedDate || selectedMachineRedux) {
      handelFilterProduction();
    }

    const [fromDate, toDate] = dateRange;

    const queryParams = {
      plant_id: localPlantData.id,
      from_date: fromDate,
      to_date: toDate,
      machine_id: selectedMachineRedux,
      product_id: selectedProductRedux,
      defect_id: null,
      shift: selectedShiftRedux
    };

    const filteredQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    const encryptedUrl = Object.fromEntries(
      Object.entries(filteredQueryParams).map(([key, val]) => {
        if (key !== "page" && key !== "page_size") {
          if (key === "from_date" || key === "to_date") {
            return [key, encryptAES(val)];
          }
          return [key, encryptAES(JSON.stringify(val))];
        }
        return [key, val];
      })
    );

    const queryString = new URLSearchParams(encryptedUrl).toString();
    const url = `dashboard/?${queryString}`;
    setLoading(true)
    apiCallInterceptor
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include authorization token
        },
      })

      .then((response) => {
        const { active_products, ...datesData } = response.data;
        dispatch(getDashboardSuccess({ datesData, activeProducts: active_products }))
        console.log(response.data)
        setFilterActive(true);
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log("Error:", error);
      });
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          getRoles(accessToken, apiCallInterceptor),
          getMachines(localPlantData.plant_name, accessToken, apiCallInterceptor),
          getDepartments(localPlantData.plant_name, accessToken, apiCallInterceptor),
          getDefects(localPlantData?.plant_name, accessToken, apiCallInterceptor),
          initialDpmuData(localPlantData.id, accessToken, apiCallInterceptor),
          getProducts(localPlantData.plant_name, accessToken, apiCallInterceptor),
          initialDateRange(),
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
    const endDate = new Date(); // Today's date
    const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD
    setDateRange([formattedStartDate, formattedEndDate]);
  };

  const { RangePicker } = DatePicker;
  const [categoryDefects, setCategoryDefects] = useState([]);
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
      })
      .catch((error) => {
        getDashboardFailure();
      });
  };

  const menu = (
    <Menu selectable={true}>
      <Menu.Item key="0">
        <Checkbox.Group
          style={{ display: "block", cursor: "default" }}
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
        <Checkbox.Group style={{ display: "block", cursor: "default" }}>
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
        <Checkbox.Group style={{ display: "block", cursor: "default" }}>
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
  return (
    <>
      {children &&
        currentUrlPath.pathname !== "/" &&
        currentUrlPath.pathname !== "/dashboard-home" ? (
        children
      ) : (
        <>
          <div className="dx-row flex  pb-4 gap-3">
            <TotalOverview machine={machines} />
            <div className="overview-container w-9/12 flex flex-col justify-between p-3 rounded-md border-2">
              <div className="filter-lg-w">
                <div className="inner-w">
                  <div className="flex flex-wrap items-start gap-2 mb-4">

                    <SelectComponent placeholder={"Select Machine"} selectedData={selectedMachineRedux} setSelectedData={setSelectedMachine} action={(val) => handleMachineChange(val)} data={machines} style={{ minWidth: "150px", zIndex: 1 }} size={"large"} />

                    <SelectComponent placeholder={"Select Products"} selectedData={selectedProductRedux} setSelectedData={setSelectedProduct} action={(val) => handleProductChange(val)} data={productsData} style={{ minWidth: "180px", zIndex: 1 }} size={"large"} />

                    <SelectComponent placeholder={"Select Shift"} selectedData={selectedShiftRedux} setSelectedData={setSelectedShift} action={(val) => handleShiftChange(val)} data={shiftDataRedux} valueType="name" style={{ minWidth: "180px", zIndex: 1 }} size={"large"} />

                    <RangePicker
                      className="dx-default-date-range"
                      size="large"
                      style={{ marginRight: "10px", minWidth: "280px", zIndex: 1 }}
                      onChange={handleDateRangeChange}
                      allowClear={false}
                      inputReadOnly
                      disabledDate={(current) => {
                        const now = Date.now();
                        const thirtyDaysAgo = new Date(now);
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                        return current && (current.valueOf() > now || current.valueOf() < thirtyDaysAgo);
                      }} value={
                        selectedDate
                          ? [
                            dayjs(selectedDate[0], "YYYY/MM/DD"),
                            dayjs(selectedDate[1], "YYYY/MM/DD"),
                          ]
                          : []
                      }
                    />

                    <div
                      type="primary"
                      onClick={handleApplyFilters}
                      className=" bg-red-500 text-white rounded flex items-center justify-center py-2 px-3 cursor-pointer font-bold"
                    >
                      Apply filters
                    </div>
                    {filterActive && filterChanged && (
                      <div
                        type="primary"
                        onClick={resetFilter}
                        className=" bg-red-500 text-white rounded flex items-center justify-center py-2 px-3 cursor-pointer font-bold"
                      >
                        Reset Filter
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className=" bg-gray-100 rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>Active Machines</span>
                        <VideoCameraOutlined />
                      </div>

                      <DropdownComponent menu={menu} data={activeMachines} />
                    </div>
                    <div className="bg-gray-100 rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>Defect Classification</span>
                        <BugOutlined />
                      </div>
                      <DropdownComponent menu={defectMenu} data={categoryDefects} />
                    </div>
                    <div className="bg-gray-100 rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>No. of SKU</span>
                        <AlertOutlined />
                      </div>

                      <DropdownComponent menu={prodMenu} data={tableDataReduxActive} />
                    </div>
                    <Link
                      to="/insights"
                      className={`relative bg-gray-100 rounded-xl text-left flex flex-col group hover:text-white hover:!bg-red-500`}
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
            selectedMachineDpmu={selectedMachineDpmu}
            machines={machines}
            machineChangeAction={(val) => handleMachineChangeDpmu(val)}
            plant_id={localPlantData.id}
            accessToken={accessToken}
          />
          <div className="production-defect-report-container flex">
            <ProductAndDefect loading={loading} chartData={productionVsDefectChartData} />
          </div>
          <DefectsReport
            loading={loading}
            chartData={tableDataRedux}
            chart1={<StackChart data={tableDataRedux} loading={loading} />}
            chart2={<PieChart data={tableDataRedux} selectedDate={selectedDate} loading={loading} />}
          />
        </>
      )}
    </>
  );
};

export default DashboardContentLayout;
