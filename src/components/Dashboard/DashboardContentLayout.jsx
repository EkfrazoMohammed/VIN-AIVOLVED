import { useState, useEffect, useRef ,Suspense , lazy, useReducer } from "react";
import TotalOverview from "./TotalOverview";
import { IoMdArrowForward } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { initialDashboardData, getMachines, getSystemStatus, getDepartments, initialDpmuData, initialProductionData, getProducts, getDefects, getRoles, dpmuFilterData, getAverageDpmu, getAverageDpmuCount } from "../../services/dashboardApi";
import { setSelectedMachine, setSelectedMachineDpmu } from "../../redux/slices/machineSlice"
import { setSelectedProduct } from "../../redux/slices/productSlice"
import { Link, useLocation } from "react-router-dom";
import { DatePicker,ConfigProvider, Spin, Button } from "antd";
import { VideoCameraFilled, BugFilled, AlertFilled } from "@ant-design/icons";

import dayjs from "dayjs";
import useApiInterceptor from "../../hooks/useInterceptor";
import {  encryptAES } from "../../redux/middleware/encryptPayloadUtils";
import SelectComponent from "../common/Select";
import { setSelectedShift } from "../../redux/slices/shiftSlice";
import { getProductVsDefectSuccess } from "../../redux/slices/productvsDefectSlice";
import DropdownComponent from "../common/DropdownComponent";
import PropTypes from 'prop-types';
import { use } from "react";


const StackChart = lazy(()=>import("../../components/chart/StackChart"))
const PieChart = lazy(()=>import("../../components/chart/PieChart"))
const RealTimeManufacturingSection  = lazy(()=>import("./RealTimeManufacturingSection"))
const ProductAndDefect  = lazy(()=>import("./ProductAndDefect"))
const DefectsReport  = lazy(()=>import("./DefectsReport"))



const DashboardContentLayout = ({ children }) => {
  const apiCallInterceptor = useApiInterceptor();
  const dispatch = useDispatch();
  const localPlantData = useSelector((state) => state?.plant?.plantData[0]);
  const accessToken = useSelector((state) => state.auth.authData[0].accessToken);
  const machines = useSelector((state) => state.machine.machinesData)
  const activeMachines = useSelector((state) => state.machine.activeMachines)
  const productsData = useSelector((state) => state.product.productsData)
  const shiftDataRedux = useSelector((state) => state.shift.shiftData)
  const selectedMachineRedux = useSelector((state) => state.machine.selectedMachine);
  const selectedMachineDpmu = useSelector((state) => state.machine.selectedMachineDpmu);
  const loaderReduxMachine = useSelector((state)=>state.machine.loading)
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
  const [ textActive , setTextActive] = useState(null)

  const [dateRange, setDateRange] = useState([
    formattedStartDate,
    formattedEndDate,
  ]);
  const [dateRangeFifteen, setDateRangeFifteen] = useState([
    formattedStartDate,
    formattedEndDate,
  ]);


  const [textData, setTextData] = useState(null);
  const[countData , setCountData] = useState(0)
  const rangePickerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const currentUrlPath = useLocation();

const initialState = {
  tableDataState:[],
  activeProducts:[],
  dpmuData:[],
  prodData:[],
  loading:false
}

const reducer = ( state ,  action) =>{
  switch(action.type){
   case 'SET_TABLE_DATA':
    return {...state , tableDataState:action.payload};
   case 'SET_ACTIVE_PRODCUTS':
    return {...state , activeProducts:action.payload};
  case 'SET_DPMU_DATA':
    return {...state , dpmuData : action.payload}  
  case "SET_PROD_DATA":
    return{...state , prodData:action.payload}
  case "SET_LOADING":
    return{...state,loading:action.payload }    
  default:
      return state
  }
}

const [state, dispatchReducer] = useReducer( reducer ,initialState)

 

  const handleMachineChange = (value) => {
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
    if (!value) {
      return dispatch(setSelectedProduct(null))
    }
    dispatch(setSelectedProduct(Number(value)));
    setFilterChanged(true)
  }

  const handleShiftChange = (value) => {
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
      setDateRangeFifteen(dateStrings)
      setFilterChanged(true)
    } else {
      console.log("Invalid date range:", dates, dateStrings);
    }
  };
  


  useEffect(() => {
    resetFilter()
  }, [localPlantData, currentUrlPath])

  useEffect(() => {
    if(selectedMachineRedux ===null && selectedProductRedux === null && selectedShiftRedux === null && selectedDate === null){
      resetFilter()
    }
  },[selectedMachineRedux, selectedProductRedux, selectedShiftRedux, selectedDate])

  const resetFilter = async () => {
    const [{active_products , ...datesData} , dpmuData , prodData] = await Promise.all([
      initialDashboardData(localPlantData.id, accessToken, apiCallInterceptor),
      initialDpmuData(localPlantData.id, accessToken, apiCallInterceptor ,dateRangeFifteen),
      initialProductionData(localPlantData.id, accessToken, apiCallInterceptor)
    ])
    dispatchReducer({type:'SET_TABLE_DATA', payload:datesData})
    // setTableData(datesData);
    dispatchReducer({type:'SET_ACTIVE_PRODCUTS', payload:active_products})
    // setActiveProducts(active_products)
    // setDpmuData(dpmuData);
    dispatchReducer({type:"SET_DPMU_DATA" , payload:dpmuData})
    // setProdata(prodData);
    dispatchReducer({type:"SET_PROD_DATA" ,payload:prodData })

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
      setTextActive(true)
     const dpmuFilter = await dpmuFilterData(apiCallInterceptor, selectedMachineRedux, localPlantData.id, dateRangeFifteen, selectedDate);
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
        await Promise.all(
          Object.entries(filteredQueryParams).map(async ([key, val]) => {
            if (key !== "page" && key !== "page_size") {
              if (key === "from_date" || key === "to_date") {
                return [key, await encryptAES(val)];
              }
              return [key, await encryptAES(JSON.stringify(val))];
            }
            return [key, val];
          })
        )
      );
      
      const queryString = new URLSearchParams(encryptedUrl).toString();

      const defectUrl = `defct-vs-machine/?${queryString}`;

      const [defectResponse] = await Promise.all([
        apiCallInterceptor.get(defectUrl),
      ])
      if (defectResponse) {
        setLoading(false)
      }
      // setDpmuData(dpmuFilter)
      dispatchReducer({type:"SET_DPMU_DATA" , payload:dpmuFilter})

      // setProdata(defectResponse.data.data_last_7_days)
      dispatchReducer({type:"SET_PROD_DATA" ,payload:defectResponse?.data?.data_last_7_days })

      // dispatch(getProductVsDefectSuccess(defectResponse.data.data_last_7_days));
    } catch (error) {
      console.log("Error:", error);
      setLoading(false)
    }
  }


  const handleApplyFilters = async() => {
    if (!selectedMachineRedux) {
      const dpmuData =  await initialDpmuData(localPlantData.id, accessToken, apiCallInterceptor);
      dispatchReducer({type:"SET_DPMU_DATA" , payload:dpmuData});
      setFilterActive(false)
    }

    if (selectedDate || selectedMachineRedux) {
      handelFilterProduction()
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
      await Promise.all(
        Object.entries(filteredQueryParams).map(async ([key, val]) => {
          if (key !== "page" && key !== "page_size") {
            if (key === "from_date" || key === "to_date") {
              return [key, await encryptAES(val)];
            }
            return [key, await encryptAES(JSON.stringify(val))];
          }
          return [key, val];
        })
      )
    );

    

    const queryString = new URLSearchParams(encryptedUrl).toString();
    const url = `dashboard/?${queryString}`;
    setLoading(true)
    try {
      const res = await apiCallInterceptor
      .get(url) 
      const { active_products , ...datesData} = res.data
      setFilterActive(true);
      // setTableData(datesData);
      dispatchReducer({type:'SET_TABLE_DATA', payload:datesData})

      // setActiveProducts(active_products)
      dispatchReducer({type:"SET_ACTIVE_PRODCUTS" , payload:active_products})

      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        await Promise.all([
          getRoles(accessToken, apiCallInterceptor),
          getMachines(localPlantData.plant_name, accessToken, apiCallInterceptor),
          getDepartments(localPlantData.plant_name, accessToken, apiCallInterceptor),
          getDefects(localPlantData?.plant_name, accessToken, apiCallInterceptor),
          initialDpmuData(localPlantData.id, accessToken, apiCallInterceptor ,dateRangeFifteen),
          getProducts(localPlantData.plant_name, accessToken, apiCallInterceptor),
          initialProductionData(localPlantData.id, accessToken, apiCallInterceptor),
          getSystemStatus(localPlantData.id, accessToken, apiCallInterceptor),
          getAverageDpmu(localPlantData.id, apiCallInterceptor, setTextData),
          getAverageDpmuCount(localPlantData.id, apiCallInterceptor,setCountData)
        ]);
        initialDateRange()

        const [prodData , filteredProductionData , {active_products , ...datesData}] = await Promise.all([
          initialProductionData(localPlantData.id, accessToken, apiCallInterceptor),
          initialDpmuData(localPlantData.id, accessToken, apiCallInterceptor ,dateRangeFifteen),
          initialDashboardData(localPlantData.id, accessToken, apiCallInterceptor)
        ])


        // totalOverviewData(fullData);
       
        // setDpmuData(dpmuData)
        dispatchReducer({type:"SET_DPMU_DATA" , payload:filteredProductionData})

        // setProdata(prodData)
        dispatchReducer({type:"SET_PROD_DATA" ,payload:prodData })

        // setTableData(datesData)
        dispatchReducer({type:'SET_TABLE_DATA', payload:datesData})

        // setActiveProducts(active_products)
        dispatchReducer({type:"SET_ACTIVE_PRODCUTS" , payload:active_products})

       
      } catch (err) {
        console.log(err.message || "Failed to fetch data")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const initialDateRange = () => {
    const getFormattedDate = (daysAgo) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().slice(0, 10);
    };
    setDateRange([getFormattedDate(6), getFormattedDate(0)]);
    setDateRangeFifteen([getFormattedDate(14), getFormattedDate(0)]);
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
    const categorizedData = categorizeDefects(state?.tableDataState);
    setCategoryDefects(categorizedData);
  }, [state?.tableDataState]);



  const defectMenu =  Object.entries(categoryDefects).map(([key, value], index) => ({
      label: `${key}`, // You can adjust this as needed, this will be the display label
      key: index.toString(), // Use index as the key to maintain uniqueness
    }));
    

  const prodMenu =  Object.entries(state.activeProducts).map(([key, value], index) => ({
    label: `${value}`, // You can adjust this as needed, this will be the display label
    key: index.toString(), // Use index as the key to maintain uniqueness
  }));

  const menu = Object.entries(activeMachines).map(([key,value], index) => ({
    label: `${value.machine_name}`, // You can adjust this as needed, this will be the display label
    key: index.toString(),
  }))


  useEffect(() => {
    // Function to handle scroll event
    const handleScroll = () => {
      // Close the RangePicker if it is open
      if (visible) {
        setVisible(false);
      }
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visible]); // Dependency array includes 'visible' to update on change

  // Handle opening/closing of the RangePicker manually
  const handleOpenChange = (open) => {
    setVisible(open);
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
            <TotalOverview machine={machines} textData={textData} countData={countData} loading={loaderReduxMachine} />
            <div className="overview-container w-9/12 flex flex-col justify-between p-3 rounded-md ">
              <div className="filter-lg-w">
                <div className="inner-w">
                  <div className="flex flex-wrap items-start gap-2 mb-4">

                    <SelectComponent placeholder={"Select Machine"} selectedData={selectedMachineRedux} setSelectedData={setSelectedMachine} action={(val) => handleMachineChange(val)} data={machines} style={{ minWidth: "150px", zIndex: 1 }} size={"large"} />

                    <SelectComponent placeholder={"Select Products"} selectedData={selectedProductRedux} setSelectedData={setSelectedProduct} action={(val) => handleProductChange(val)} data={productsData} style={{ minWidth: "180px", zIndex: 1 }} size={"large"} />

                    <SelectComponent placeholder={"Select Shift"} selectedData={selectedShiftRedux} setSelectedData={setSelectedShift} action={(val) => handleShiftChange(val)} data={shiftDataRedux} valueType="name" style={{ minWidth: "180px", zIndex: 1 }} size={"large"} />


                    <ConfigProvider
  theme={{
    token: {
    
    },
  }}
>
<RangePicker
                      className="dx-default-date-range"
                      size="large"
                      ref={rangePickerRef}
                      open={visible} // Control visibility based on scroll
                      onOpenChange={handleOpenChange} // Update visibility state when user manually opens/closes
                      style={{ marginRight: "10px", minWidth: "280px", zIndex: 1 ,background:"#d2d7e9",  }}
                      onChange={handleDateRangeChange}
                      allowClear={false}
                      inputReadOnly
                      disabledDate={(current) => {
                        const now = Date.now();
                        const thirtyDaysAgo = new Date(now);
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                        return current && (current.valueOf() > now || current.valueOf() < thirtyDaysAgo);
                      }}
                      value={
                        selectedDate
                          ? [
                            dayjs(selectedDate[0], "YYYY/MM/DD"),
                            dayjs(selectedDate[1], "YYYY/MM/DD"),
                          ]
                          : []
                      }
                    /></ConfigProvider>


               


                    <Button
                      type="primary"
                      onClick={handleApplyFilters}
                      disabled={selectedShiftRedux === null && selectedMachineRedux === null && selectedProductRedux === null && selectedDate === null} 
                      className=" commButton text-white rounded flex items-center justify-center py-2 px-3 cursor-pointer font-bold"
                    >
                      Apply filters
                    </Button>
                    {filterActive && filterChanged && (
                      <Button
                        type="primary"
                        
                        onClick={resetFilter}
                        className=" commButton text-white rounded flex items-center justify-center py-2 px-3 cursor-pointer font-bold"
                      >
                        Reset Filter
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className=" bg-[#D2D7E9] rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>Active Machines</span>
                        <VideoCameraFilled />
                      </div>
                      <DropdownComponent items={menu} data={activeMachines} />
                    </div>
                    <div className="bg-[#D2D7E9] rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>Defect Classification</span>
                        <BugFilled />
                      </div>
                      <DropdownComponent items={defectMenu} data={categoryDefects} />
                    </div>
                    <div className="bg-[#D2D7E9] rounded-xl text-left flex flex-col">
                      <div className="flex justify-between items-center p-3 flex-1 text-lg w-full gap-3">
                        <span>No. of SKU</span>
                        <AlertFilled />
                      </div>
                      <DropdownComponent items={prodMenu} data={state.activeProducts} />
                    </div>
                    <Link
                      to="/insights"
                      className={`inisigts_page relative  rounded-xl text-left flex flex-col group text-white font-bold `}
                    >
                       <div className="flex justify-center items-center p-3 flex-1 text-3xl w-full gap-1 flex-col  ">
                        <span>Insights</span>
                        <img src="https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/sparkling.png" alt="" className="w-6 absolute top-3 left-3" />
                      <IoMdArrowForward className="w-12" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          

          <Suspense fallback={"Loading..."} >

          <RealTimeManufacturingSection
            loading={loading}
            categoryDefects={categoryDefects}
            productionData={state?.dpmuData}
            selectedMachineDpmu={selectedMachineDpmu}
            machines={machines}
            machineChangeAction={(val) => handleMachineChangeDpmu(val)}
            plant_id={localPlantData.id}
            accessToken={accessToken}
            textActive={textActive}
          />
          </Suspense> 


          
          <div className="production-defect-report-container flex">
          <Suspense fallback="Loading...">
            <ProductAndDefect loading={loading} chartData={state.prodData}  localPlantData={localPlantData}             textActive={textActive}
            />
          </Suspense>
          </div>
          <Suspense fallback={"Loading..."} >

          <DefectsReport
            className="bg-white"
            loading={loading}
            chartData={state.tableDataState}
            chart1={
              <Suspense fallback={"Loading..."} >
                <StackChart data={state.tableDataState}  localPlantData={localPlantData} loading={loading} dateRange={dateRange}  />
              </Suspense>
          }
            chart2={
              <Suspense fallback={"Loading..."} >
                <PieChart data={state.tableDataState

} localPlantData={localPlantData} selectedDate={selectedDate} loading={loading}  dateRange={dateRange} />
              </Suspense>
          }
          />
          </Suspense>
        </>
      )}
    </>
  );
};
// PROP VALIDATION 
DashboardContentLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardContentLayout;
