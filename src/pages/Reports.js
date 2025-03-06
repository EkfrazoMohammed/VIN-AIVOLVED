import React, { useState, useEffect, useRef , useReducer} from "react";
import { useLocation } from "react-router-dom";
import { Table, Select, DatePicker, Button, Image ,Modal ,ConfigProvider, Pagination, Spin } from "antd";
import * as XLSX from "xlsx";
import { DownloadOutlined } from "@ant-design/icons";
import { Hourglass } from "react-loader-spinner";
import dayjs from "dayjs";
import { useSelector, useDispatch } from "react-redux";
import { reportApi } from "./../services/reportsApi";

import {
  setSelectedDefectReports,
} from "../redux/slices/defectSlice";


import axios from "axios"
import { getReportData, updatePage } from ".././redux/slices/reportSlice";
import { setSelectedMachine } from "../redux/slices/machineSlice"
import { setSelectedProduct } from "../redux/slices/productSlice";
import useApiInterceptor from "../hooks/useInterceptor";
import {  decryptAES,  encryptAES } from "../redux/middleware/encryptPayloadUtils";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import SelectComponent from "../components/common/Select";
import { debounce } from 'lodash';

const ImageRenderer = ({ image_b64 }) => {

  if (!image_b64) return null;

  const decrypData = decryptAES(image_b64);

  return (
    <div className="w-12 h-12 object-contain p-0 m-0 flex justify-center items-center">
    <Image
      src={decrypData}
      alt="Defect Image"
      loading={true}
      style={{ width: "100%", height: "3rem" }}
      placeholder={
        <div className="w-full h-full flex justify-center items-center"><Spin/></div>
      } 
    />
    </div>
  );
};




const columns = [
  {
    title: <div className="text-center" >Product Name</div> ,
    dataIndex: "product",
    key: "alert_name",
    id: "alert_name",
    render:  (text) => {
      const decrypData =  decryptAES(text)
      return (

        <>
          {
            decrypData ? <div className="text-center text-[0.6rem] xl:text-sm" >{decrypData}</div> : null
          }
        </>
      )
    },
  },
  {
    title:   <div className="text-center" >Defect Name</div>,
    dataIndex: "defect",
    key: "defect_name",
    render:  (text) => {
      const decrypData =  decryptAES(text)
      return (
        <>
          {
            decrypData ? <div className="text-center text-[0.6rem] xl:text-sm" >{decrypData}</div> : null
          }
        </>
      )
    },
  },
  {
    title: <div className="text-center" >Machine Name</div> ,
    dataIndex: "machine",
    key: "machine_name",

    render:  (text) => {
      const decrypData =  decryptAES(text)
      return (

        <>
          {
            decrypData ? <div className="text-center text-[0.6rem] xl:text-sm" >{decrypData}</div> : null
          }
        </>
      )
    },
  },
  {
    title:   <div className="text-center"> Department Name</div>,
    dataIndex: "department",
    key: "department_name",

    render:  (text) => {
      const decrypData =  decryptAES(text)
      return (

        <>
          {
            decrypData ? <div className="text-center text-[0.6rem] xl:text-sm" >{decrypData}</div> : null
          }
        </>
      )
    },
  },

  {
    title: "Recorded Date Time",
    dataIndex: "recorded_date_time",
    key: "recorded_date_time",
    render:  (text) => {
      const decrypData =  decryptAES(text);
      const formattedDateTime = decrypData ? decrypData.replace("T", " ") : null;
      return (
        <>
          {formattedDateTime ? <div className="text-[0.6rem] xl:text-sm ">{formattedDateTime}</div> : null}
        </>
      );
    },
  },
  {
    title: "Shift",
    dataIndex: "shift",
    key: "shift",

    render:  (text) => {
      const decrypData =  decryptAES(text);
      return (
        <>
          {decrypData ? <div className="text-[0.6rem] xl:text-sm">{decrypData}</div> : null}
        </>
      );
    },
  },
  {
    title: "OCR",
    dataIndex: "ocr",
    key: "ocr",

    render:  (text) => {
      const decrypData =  decryptAES(text);
      return (
        <>
          {decrypData ? <div className="text-[0.6rem] xl:text-sm">{decrypData}</div> : null}
        </>
      );
    },
  },

  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image_b64) => <ImageRenderer image_b64={image_b64} />,

  },
];


const locale = {
  Table: {
    sortTitle: "Sort",
    triggerAsc: "Click to sort in ascending order by defect name",
    triggerDesc: "Click to sort in descending order by defect name",
    cancelSort: "Click to cancel sorting",
  },
};



const Reports = () => {
  // INTERCEPTOR API CALLING
  const apiCallInterceptor = useApiInterceptor()
  const rangePickerRef = useRef(null);
  const localPlantData = useSelector((state) => state.plant.plantData[0]);
  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );
  const machines = useSelector((state) => state.machine.machinesData)
  const defectsData = useSelector((state) => state.defect.defectsData)
  const productsData = useSelector((state) => state.product.productsData)
  const shiftData = useSelector((state) => state.shift.shiftData)
  const location = useLocation();

let defectProp = location?.state;

const [queryParamState, setQueryParamState] = useState({
  defect: defectProp,
  machine: null,
  product: null,
  shift: null
});


const initailState = {
  reportData:[],
  selectedMachine: null,
  selectedProduct: null,
  selectedDefect: defectProp,
  selectedShift: null,
  apiCallInProgress:false,
  pagination:{
      current: 1,
      pageSize: 10,
      total: 0,
      position: ["topRight"],
      showSizeChanger: true,
  }
}

const reducer = (state ,  action) => {
  switch(action.type){
    case 'REPORT_DATA':
      return {...state , reportData:action.payload}
    case 'SET_SELECTED_MACHINE':
      return {...state,selectedMachine :action.payload };
    case 'SET_SELECTED_PRODUCT':
      return {...state , selectedProduct:action.payload};
    case 'SET_SELECTED_DEFECT':
      return {...state , selectedDefect:action.payload};
    case 'SET_SELECTED_SHIFT':
      return {...state , selectedShift:action.payload};
    case 'API_CALLPROGESS':
      return {...state , apiCallInProgress:action.payload} ;
    case 'SET_PAGINATION':
      return {...state ,pagination:{
...state.pagination,
...action.payload
      } };

    case 'RESET_PAGINATION':
        return {
          ...state,
          pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
          position: ["topRight"],
          showSizeChanger: true,
          }
        };
  
    default:
      return state      
  }
}

  const [ state , dispatch] = useReducer(reducer , initailState)
  const dateFormat = "YYYY/MM/DD";

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const [dateRange, setDateRange] = useState();

  const [selectedDate, setSelectedDate] = useState(null);
  const { RangePicker } = DatePicker;
  const [filterActive, setFilterActive] = useState(defectProp);
  const [filterChanged, setFilterChanged] = useState(defectProp);


  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false)

  const messages  = [];
  const ws = null;
  const handleDownload = async () => {
    const params = {
      plant_id: localPlantData?.id || undefined,
      from_date: dateRange?.[0] || undefined,
      to_date: dateRange?.[1] || undefined,
      machine_id: state.selectedMachine || undefined,
      product_id: state.selectedProduct || undefined,
      defect_id: state.selectedDefect || undefined,
    };
    // Filter out undefined or null values from query parameters
    const filteredQueryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

     sendMessage(filteredQueryParams)
  }


  useEffect(() => {
    const handleScroll = () => {
      if (rangePickerRef.current) {
        rangePickerRef.current.blur(); // Close the RangePicker dropdown
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [rangePickerRef]);

  useEffect(() => {
    if (messages.length > 0) {
      // Trigger download function after state has been updated
      downloadAllImages();
    }
  }, [messages]);
  // Send a message to the WebSocket server
  const sendMessage = (params) => {
    if (ws) {
      const data = JSON.stringify(params)
      ws.send(data);
      setModal(false)
      setSelectedDate(null);
      dispatch(setSelectedMachine(null)); // Dispatching action    
      dispatch(setSelectedProduct(null)); // Dispatching action 
      dispatch(setSelectedDefectReports(null));
    }
  };


  const initialReportData = async (page = 1, pageSize = 10) => {
    setLoader(true)
    dispatch({type:"API_CALLPROGESS", payload:true})
    try {
          const res = await reportApi(localPlantData?.id, pageSize, accessToken, page, apiCallInterceptor)
      const { page_size, total_count, results } = res;
      dispatch({type:"REPORT_DATA" , payload:results})
      setPagination(page, page_size, total_count);
      setTimeout(()=>{
        setLoader(false)
      },[1000])
    } catch (error) {
      setLoader(false)
    }
 
    
  }

  useEffect(() => {
    if (filterActive) {
      handleApplyFilters(state.pagination.current, state.pagination.pageSize);
    } else {
      initialReportData(state.pagination.current, state.pagination.pageSize);
    }
  }, []);

  useEffect(()=>{
const allNull = Object.values(queryParamState).every(value => value === null);

if (allNull) {
  initialReportData();
  setFilterActive(false);
} else {
  Object.values(queryParamState).forEach((key) => {
    console.log(key);
  });

}

  },[queryParamState])
  
  

  
  const handleTableChange = (pagination) => {
    setPagination(pagination.current, pagination.pageSize); // Update pagination state
    // dispatch(updatePage({ current: pagination.current, pageSize: pagination.pageSize }));
    if (filterActive) {
      handleApplyFiltersPagination(pagination.current,pagination.pageSize);
    } else {
      initialReportData(pagination.current, pagination.pageSize);
    }
  };
  


  // const handleDefectChange = (value) => {
  //   if (!value) {
  //     return dispatch({type:"SET_SELECTED_DEFECT" , payload:null})
  //   }
  //   dispatch({type:"SET_SELECTED_DEFECT", payload:value})
  //   setFilterChanged(true)
  // };

  // const handleMachineChange = (value) => {
  //   if (!value) {
  //     return dispatch({type:'SET_SELECTED_MACHINE', payload:null})
  //   };
  //   dispatch({type:'SET_SELECTED_MACHINE', payload:Number(value)}) 
  //   setFilterChanged(true)

  // };

  // const handleProductChange = (value) => {
  //   if (!value) {
  //     return dispatch({type:'SET_SELECTED_PRODUCT', payload:null})
  //   }
  //   dispatch({type:'SET_SELECTED_PRODUCT', payload:value})    
  //   setFilterChanged(true)
  // }

  // const handleShiftChange = (value) => {
  //   if (!value) {
  //     return dispatch({type:'SET_SELECTED_SHIFT', payload:null})
  //   }
  //   dispatch({type:'SET_SELECTED_SHIFT', payload:value}) 
  //   setFilterChanged(true)
  // }

  const handleDefectChange = (value) => {
    const updatedValue = value || null;
  
    setQueryParamState((prev) => ({ ...prev, defect: updatedValue }));
    setFilterChanged(true);
  };
  const handleMachineChange = (value) => {
    const updatedValue = value ? Number(value) : null;
  
    setQueryParamState((prev) => ({ ...prev, machine: updatedValue }));
    setFilterChanged(true);
  };
  
  const handleProductChange = (value) => {
    const updatedValue = value || null;
  
    setQueryParamState((prev) => ({ ...prev, product: updatedValue }));
    setFilterChanged(true);
  };
  
  const handleShiftChange = (value) => {
    const updatedValue = value || null;
    setQueryParamState((prev) => ({ ...prev, shift: updatedValue }));
    setFilterChanged(true);
  };
  


  const setPagination = (current, pageSize, total) => {
    dispatch({ type: "SET_PAGINATION", payload: { current, pageSize, total } });
  };
  

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dateStrings) {
      setSelectedDate(dateStrings);
      setDateRange(dateStrings);
      setFilterChanged(true)
    } 
  };



  const handleApplyFiltersPagination = async(page,pageSize) => {
    setLoader(true);
    const params = {
      page, // Ensure this uses the provided page (default is 1)
      page_size: pageSize,
      plant_id: await encryptAES(JSON.stringify(localPlantData?.id)) || undefined,
      from_date: dateRange?.[0] || undefined,
      to_date: dateRange?.[1] || undefined,
      machine_id: state.selectedMachine || undefined,
      product_id: state.selectedProduct || undefined,
      defect_id: state.selectedDefect,
      shift: state.selectedShift
    };

    const filteredQueryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
    const encryptedUrl = Object.fromEntries(
      await Promise.all(
        Object.entries(filteredQueryParams).map(async ([key, val]) => {
          if (key !== "page" && key !== "page_size" && key !== "plant_id") {
            if (key === "from_date" || key === "to_date") {
              return [key, await encryptAES(val)];
            }
            return [key, await encryptAES(JSON.stringify(val))];
          }
          return [key, val];
        })
      )
      )
    const queryString = new URLSearchParams(encryptedUrl).toString();
    const url = `reports/?${queryString}`;


   try {
    const response  = await apiCallInterceptor(url);
    const { results, total_count, page_size } = response.data;
    dispatch({type:"REPORT_DATA", payload:results})
    setPagination(page,page_size,total_count)
    setTimeout(()=>{
      setLoader(false);
    },[1000])
    setFilterActive(true);
   } catch (error) {
    setLoader(false); // Ensure loader is stopped in case of error
  }
  finally {
     dispatch({type:"API_CALLPROGESS", payload:false})
  }
  };


  const handleApplyFilters = async(page = 1, pageSize = 10) => {
    setLoader(true);

    const params = {
      page,
      page_size: pageSize,
      plant_id: await encryptAES(JSON.stringify(localPlantData?.id)) || undefined,
      from_date: dateRange?.[0] || undefined,
      to_date: dateRange?.[1] || undefined,
      machine_id: queryParamState.machine || undefined,  // Use local state here
      product_id: queryParamState.product || undefined,  // Use local state here
      defect_id: queryParamState.defect || undefined,  // Use local state here
      shift: queryParamState.shift || undefined,  // Use local state here
    };
  
    const hasActiveFilters = Object.entries(params).some(([key, value]) => {
      return ['from_date', 'to_date', 'machine_id', 'product_id', 'defect_id', 'shift'].includes(key) && value !== undefined;
    });
  
    // if (!hasActiveFilters) {
    //   setFilterActive(false);
    //   setFilterChanged(false);
    //   return initialReportData(page, pageSize);  // Proceed without filters
    // }
  
    // Filter out null or undefined values from the query parameters
    const filteredQueryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
  
    // Encrypt sensitive parameters
    const encryptedUrl = Object.fromEntries(
      await Promise.all(
        Object.entries(filteredQueryParams).map(async ([key, val]) => {
          if (key !== "page" && key !== "page_size" && key !== "plant_id") {
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
    const url = `reports/?${queryString}`;
  
    try {
      const response = await apiCallInterceptor(url);
      const { results, total_count, page_size } = response.data;
  
      // Dispatch the updated data to global reducer
      dispatch({ type: "REPORT_DATA", payload: results });
      dispatch({
        type: "SET_SELECTED_MACHINE",
        payload: queryParamState.machine,
      });
      dispatch({
        type: "SET_SELECTED_PRODUCT",
        payload: queryParamState.product,
      });
      dispatch({
        type: "SET_SELECTED_DEFECT",
        payload: queryParamState.defect,
      });
      dispatch({
        type: "SET_SELECTED_SHIFT",
        payload: queryParamState.shift,
      });
  
      // Update pagination state
      setPagination(page, page_size, total_count);
      setFilterActive(true);
      setFilterChanged(true);  // Reset the filter changed flag after applying
    } catch (error) {
      // Handle API error
      console.error("Error applying filters:", error);
    } finally {
      setLoader(false);
      dispatch({ type: "API_CALLPROGESS", payload: false });
    }
  };
  




  const downloadAllImages = async () => {
  
    const zip = new JSZip();
    const folder = zip.folder('VIN IMAGES'); // Single folder for all images

    for (const item of messages) {
      for (const [category, urls] of Object.entries(item)) {
        for (let i = 0; i < urls.length; i++) {
          const url = urls[i];
          try {
            const response = await axios.get(url, { responseType: 'blob' }); // Fetch the image as a blob
            const imageBlob = response.data;
            const extension = imageBlob.type.split('/')[1];
            const fileName = `${category.replace(/[^a-z0-9]/gi, '_')}_${i + 1}.${extension}`; // Sanitize filename

            folder.file(fileName, imageBlob); // Add image to folder
          } catch (error) {
            //console.error(`Error fetching image ${i + 1} from category ${category}:`, error);
          }
        }
      }
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'images.zip'); // Save the zip file
    });
  };

  
  const downloadExcel = () => {
    // Prepare the table data with correct headers
    const formattedTableData = state.reportData.map( (item) => ({
      "Product Name":  decryptAES(item.product),
      "Defect Name":  decryptAES(item.defect),
      "Machine Name":  decryptAES(item.machine),
      "Department Name":  decryptAES(item.department),
      "Recorded Date Time":  decryptAES(item.recorded_date_time).replace("T", " "),
      // "Image": await decryptAES(item.image) ,
      "Image Link": {
        v:  decryptAES(item.image), // Displayed text
        l: { Target:  decryptAES(item.image), Tooltip: 'Click to view the image' } // Hyperlink
      }
    }));
    // Convert JSON to Excel with correct headers
    const ws = XLSX.utils.json_to_sheet(formattedTableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Save Excel file
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    // Create link and trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.xlsx";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  const resetFilter =  () => {
    setFilterActive(false);
    setQueryParamState({
      defect: null,
      machine: null,
      product: null,
      shift: null
    })
    dispatch({ type: 'RESET_PAGINATION' });
    setDateRange(null)
    setSelectedDate(null);
    dispatch({type:'SET_SELECTED_SHIFT', payload:null})
    dispatch({type:'SET_SELECTED_PRODUCT', payload:null})
    dispatch({type:'SET_SELECTED_MACHINE', payload:null})
    dispatch({type:"SET_SELECTED_DEFECT" , payload:null})
    setFilterChanged(false)
    initialReportData()
  };



  return (
    <>
      {/* <ToastContainer /> */}
      <Modal
        title={<div style={{ padding: "1rem", textAlign: "center" }}>Apply filters to download the images
        </div>}
        centered
        open={modal}
        onCancel={() => {
          setModal(false); setSelectedDate(null); dispatch(setSelectedDefectReports(null)); // Dispatching action    
          dispatch(setSelectedProduct(null));
          setFilterChanged(false)
        }}
        footer={[
            <Button key="submit" type="primary" style={{ backgroundColor: "#ec522d", }} onClick={handleDownload}>Download</Button>
      
        ]}
      >
        <div className="" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>

          <Select
            style={{ minWidth: "200px", marginRight: "10px", }}
            showSearch
            placeholder="Select Product"
            onChange={handleProductChange}
            value={state.selectedProduct}
            size="large"
            filterOption={(input, productsData) =>
              (productsData.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {productsData.map((prod) => (
              <Select.Option key={prod.id} value={prod.id}>
                {prod.name}
              </Select.Option>
            ))}

          </Select>

          <Select
            style={{ minWidth: "200px", marginRight: "10px" }}
            showSearch
            placeholder="Select Defect"
            onChange={handleDefectChange}
            value={state.selectedDefect}
            size="large"
            filterOption={(input, defectsData) =>
              // ( productOptions.children ?? "".toLowerCase() ).includes(input.toLowerCase() )
              (defectsData.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {defectsData.map((defect) => (
              <Select.Option key={defect.id} value={defect.id}>
                {defect.name}
              </Select.Option>
            ))}
          </Select>
          
    


          <ConfigProvider
  theme={{
    token: {
    colorText:"#fff",
    colorBgContainer:"#d2d7e9"
    },
  }}
>

          <RangePicker
                      className="dx-default-date-range"
                      ref={rangePickerRef}
            size="large"
            style={{ marginRight: "10px" , backgroundColor:"#d2d7e9"}}
            onChange={handleDateRangeChange}
            allowClear={false}
            inputReadOnly={true}
            disabledDate={(current) => {
              const now = Date.now();
              const thirtyDaysAgo = new Date(now);
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

              return current && (current.valueOf() > now || current.valueOf() < thirtyDaysAgo);
            }}            value={
              selectedDate
                ? [
                  dayjs(selectedDate[0], dateFormat),
                  dayjs(selectedDate[1], dateFormat),
                ]
                : []
            }
          />
</ConfigProvider>
        </div>

      </Modal >
      <div className="layout-content">
        <div
          className=""
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
        >
          <SelectComponent placeholder={"Select Product"} action={(val) => handleProductChange(val)} selectedData={queryParamState.product} data={productsData} size={"large"} style={{ minWidth: "200px", marginRight: "10px", }} />
          <SelectComponent placeholder={"Select Machine"} action={(val) => handleMachineChange(val)} selectedData={queryParamState.machine} data={machines} size={"large"} style={{ minWidth: "200px", marginRight: "10px" }} />
          <SelectComponent placeholder={"Select Defect"} action={(val) => handleDefectChange(val)} selectedData={queryParamState.defect} data={defectsData} size={"large"} style={{ minWidth: "200px", marginRight: "10px" }} />
          <SelectComponent placeholder={"Select Shift"} selectedData={queryParamState.shift} action={(val) => handleShiftChange(val)} data={shiftData} valueType="name" style={{ minWidth: "180px", zIndex: 1 }} size={"large"} />
          <ConfigProvider
  theme={{
    token: {
    colorText:"#000",
    colorBgContainer:"#d2d7e9"
    },
  }}
>

          <RangePicker
                      className="dx-default-date-range"
                      ref={rangePickerRef}
            size="large"
            style={{ marginRight: "10px" , backgroundColor:"#d2d7e9"}}
            onChange={handleDateRangeChange}
            allowClear={false}
            inputReadOnly={true}
            disabledDate={(current) => {
              const now = Date.now();
              const thirtyDaysAgo = new Date(now);
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

              return current && (current.valueOf() > now || current.valueOf() < thirtyDaysAgo);
            }}            value={
              selectedDate
                ? [
                  dayjs(selectedDate[0], dateFormat),
                  dayjs(selectedDate[1], dateFormat),
                ]
                : []
            }
          />
</ConfigProvider>

          <Button
            // type="primary"
            disabled={!filterChanged}
            onClick={() =>
              handleApplyFilters()
            }
            style={{
              fontSize: "0.9rem",
              marginRight: "10px",
            }}
          className="commButton"
          >
            Apply filters
          </Button>


          {filterActive && filterChanged ? (
            <Button
              type="primary"
              onClick={resetFilter}
              style={{
                fontSize: "1rem",
                marginRight: "10px",
              }}
              className="commButton"
            >
              Reset Filter
            </Button>
          ) : null}
          {state.reportData?.length > 0 ? (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              style={{ fontSize: "0.9rem"}}
              onClick={downloadExcel}
                className="commButton"
            >
              Download Excel
            </Button>
          ) : null}
          {/* <Button
            type="primary"
            disabled={!reportData.length > 0}
            icon={<DownloadOutlined />}
            size="large"
            style={{ fontSize: "1rem", backgroundColor: "#ec522d" }}
            onClick={downloadExcel}
          >
            Download Excel
          </Button> */}
          {/* <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            style={{ fontSize: "1rem", backgroundColor: "#ec522d" }}
            onClick={handleClickDownload}
          >
            Download Images
          </Button> */}
        </div>

        {loader ? (
          <div
            className=""
            style={{
              height: "60vh",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px",
              marginTop: "1rem",
              borderRadius: "10px",
            }}
          >
            <Hourglass
              visible={true}
              height="40"
              width="40"
              ariaLabel="hourglass-loading"
              wrapperStyle={{}}
              wrapperClass=""
              colors={[" #06175d", "#06175d"]}
            />
          </div>
        ) : (
          <ConfigProvider
          theme={{
            components: {
              Table: {
                colorBgContainer: '#fff',
                colorPrimary: '#000',
                colorFillAlter: '#fff',
                controlHeight: 48,
                headerBg: '#43996a',
                headerColor: '#fff',
                rowHoverBg: '#e6f7ff',
                padding: '1rem',
                boxShadowSecondary:
                  '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                fontWeightStrong: 500,
              },
            },
          }}
        >

          <Table
            columns={columns}
            dataSource={state.reportData}
            pagination={state.pagination}
            locale={locale.Table}
            style={{ margin: "1rem 0", fontSize: "1.5rem" }}
            loading={loader}
            onChange={handleTableChange}
            className="custom-table"
          />
        </ConfigProvider>
        )}
      </div>
    </>
  );
};

export default Reports;