import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Table, Select, DatePicker, Button, Image, Tag } from "antd";
import * as XLSX from "xlsx";
import { DownloadOutlined } from "@ant-design/icons";
import { Hourglass } from "react-loader-spinner";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { initialDashboardData, getDefects, getMachines, getSystemStatus, getDepartments, initialDpmuData, initialProductionData, getProducts } from "./../services/dashboardApi";
import { reportApi } from "./../services/reportsApi";
import {
  setSelectedDefect,
  setSelectedDefectReports,
} from "../redux/slices/defectSlice"; // Import the actions

import axios from "axios"
import { getReportData, updatePage } from ".././redux/slices/reportSlice";
import { setSelectedMachine } from "../redux/slices/machineSlice"
import { setSelectedProduct } from "../redux/slices/productSlice";
import useApiInterceptor from "../hooks/useInterceptor";
import { decryptAES, encryptAES } from "../redux/middleware/encryptPayloadUtils";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Modal } from "antd";
import SelectComponent from "../components/common/Select";
import { current } from "@reduxjs/toolkit";

import { setSelectedShift } from "../redux/slices/shiftSlice";


const columns = [
  {
    title: "Product Name",
    dataIndex: "product",
    key: "alert_name",
    id: "alert_name",
    sorter: (a, b) => a.product.localeCompare(b.product),
    sortDirections: ["ascend", "descend", "cancel"],
    render: (text) => {
      const decrypData = decryptAES(text)
      return (

        <>
          {
            decrypData ? <div >{decrypData}</div> : null
          }
        </>
      )
    },
  },
  {
    title: "Defect Name",
    dataIndex: "defect",
    key: "defect_name",
    sorter: (a, b) => a.defect.localeCompare(b.defect),

    sortDirections: ["ascend", "descend", "cancel"],
    render: (text) => {
      const decrypData = decryptAES(text)
      return (

        <>
          {
            decrypData ? <div >{decrypData}</div> : null
          }
        </>
      )
    },
  },
  {
    title: "Machine Name",
    dataIndex: "machine",
    key: "machine_name",
    sorter: (a, b) => a.machine.localeCompare(b.machine),
    sortDirections: ["ascend", "descend", "cancel"],
    render: (text) => {
      const decrypData = decryptAES(text)
      return (

        <>
          {
            decrypData ? <div >{decrypData}</div> : null
          }
        </>
      )
    },
  },
  {
    title: "Department Name",
    dataIndex: "department",
    key: "department_name",
    sorter: (a, b) => a.department.localeCompare(b.department),
    sortDirections: ["ascend", "descend", "cancel"],
    render: (text) => {
      const decrypData = decryptAES(text)
      return (

        <>
          {
            decrypData ? <div >{decrypData}</div> : null
          }
        </>
      )
    },
  },

  {
    title: "Recorded Date Time",
    dataIndex: "recorded_date_time",
    key: "recorded_date_time",
    render: (text) => {
      const decrypData = decryptAES(text);
      const formattedDateTime = decrypData ? decrypData.replace("T", " ") : null;
      return (
        <>
          {formattedDateTime ? <div>{formattedDateTime}</div> : null}
        </>
      );
    },
  },
  {
    title: "OCR",
    dataIndex: "ocr",
    key: "ocr",

    render: (text) => {
      const decrypData = decryptAES(text);
      // const formattedDateTime = decrypData ? decrypData.replace("T", " ") : null;
      return (
        <>
          {decrypData ? <div>{decrypData}</div> : null}
        </>
      );
    },
  },

  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image_b64) => {

      const decrypData = decryptAES(image_b64)
      return (
        <>{
          image_b64 ? (
            <Image src={decrypData} alt="Defect Image" width={50} />
          ) : null}
        </>
      )
    }
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

  // REDUX CALLING
  const dispatch = useDispatch()
  const reportData = useSelector((state) => state.report.reportData);
  // const pagination = useSelector((state) => state.report.pagination);
  const localPlantData = useSelector((state) => state.plant.plantData[0]);
  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );
  const machines = useSelector((state) => state.machine.machinesData)
  const defectsData = useSelector((state) => state.defect.defectsData)
  const productsData = useSelector((state) => state.product.productsData)
  const shiftData = useSelector((state) => state.shift.shiftData)

  const selectedMachineRedux = useSelector((state) => state.machine.selectedMachine);
  const selectedProductRedux = useSelector((state) => state.product.selectedProduct);
  const selectedShiftRedux = useSelector((state) => state.shift.selectedShift)
  // const selectedDefectRedux = useSelector((state) => state.defect.selectedDefect);
  const selectedDefectRedux = useSelector((state) => state.defect.selectedDefectReports);
  const [dropdownVisible, setDropdownVisible] = useState(true);
  const [initialScrollY, setInitialScrollY] = useState(0);
  const scrollThreshold = window.innerHeight * 0.05;

  const dateFormat = "YYYY/MM/DD";
  const location = useLocation();
  let defectProp = location?.state?.filterActive;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const [dateRange, setDateRange] = useState();

  const [selectedDate, setSelectedDate] = useState(null);
  const { RangePicker } = DatePicker;
  const [filterActive, setfilterActive] = useState(defectProp);
  const [filterChanged, setfilterChanged] = useState(defectProp);


  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false)
  // PAGINATION

  const [pagination, setPagination] = useState(
    {
      current: 1,
      pageSize: 10,
      total: 0,
      position: ["topRight"],
      showSizeChanger: true,

    }
  )


  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);




  const handleDownload = async () => {
    const params = {
      plant_id: localPlantData?.id || undefined,
      from_date: dateRange?.[0] || undefined,
      to_date: dateRange?.[1] || undefined,
      machine_id: selectedMachineRedux || undefined,
      product_id: selectedProductRedux || undefined,
      defect_id: selectedDefectRedux || undefined,
    };
    // Filter out undefined or null values from query parameters
    const filteredQueryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    //console.log(filteredQueryParams)
    await sendMessage(filteredQueryParams)
  }



  const socketConnection = () => {
    // Create a new WebSocket connection
    const socket = new WebSocket('wss://hul.aivolved.in/ws/defect-image-streaming/');

    // Set WebSocket state
    setWs(socket);

    // Connection opened
    socket.onopen = () => {
      //console.log('Connected to WebSocket server');
    };

    // Listen for messages
    socket.onmessage = async (event) => {
      //console.log('Message from server: ', JSON.parse(event.data));
      const data = JSON.parse(event.data)
      setMessages((prev) => [data.data]);

    };

    // Handle errors
    socket.onerror = (error) => {
      //console.error('WebSocket error: ', error);
    };

    // Connection closed
    socket.onclose = () => {
      //console.log('Disconnected from WebSocket server');
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  };


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

  const initialReportData = () => {

    setLoader(true)
    reportApi(localPlantData?.id, pagination.pageSize, accessToken, pagination.current, apiCallInterceptor)
      .then(res => {
        const { page_size, total_count, results } = res;
        dispatch(getReportData({
          reportData: results,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total_count,
        }));
        setPagination((prev) => ({ ...prev, pageSize: page_size, total: total_count }))
        setLoader(false)
      })
      .catch(err => {
        //console.error(err)
        setLoader(false)

      });
  }
  // Fetch filtered data when filters are applied or pagination changes while filters are active
  useEffect(() => {
    if (filterActive) {
      handleApplyFilters(pagination.current);
    } else {
      initialReportData()
    }
  }, [pagination.current, pagination.pageSize, accessToken]);

  // useEffect(() => {
  //   if (!filterActive) {
  //     //console.log('calling init')
  //     initialReportData()
  //   }
  // }, [pagination.current, pagination.pageSize, accessToken]);

  const handleTableChange = (pagtn) => {
    setPagination((prev) => ({ ...prev, current: pagtn.current, pageSize: pagtn.pageSize, }))
    dispatch(updatePage({
      current: pagtn.current,
      pageSize: pagtn.pageSize
    }))
  };


  const handleDefectChange = (value) => {
    if (!value) {
      return dispatch(setSelectedDefectReports(null))
    }
    dispatch(setSelectedDefectReports(Number(value)))
    setfilterChanged(true)
  };

  const handleMachineChange = (value) => {
    if (!value) {
      return dispatch(setSelectedMachine(null))
    };
    dispatch(setSelectedMachine(Number(value))); // Dispatching action    
    setfilterChanged(true)

  };

  const handleProductChange = (value) => {
    if (!value) {
      return dispatch(setSelectedProduct(null))
    }
    dispatch(setSelectedProduct(Number(value))); // Dispatching action    
    setfilterChanged(true)
  }

  const handleShiftChange = (value) => {
    if (!value) {
      return dispatch(setSelectedShift(null))
    }
    dispatch(setSelectedShift(value));
    setfilterChanged(true)
  }


  const handleDateRangeChange = (dates, dateStrings) => {
    if (dateStrings) {
      setSelectedDate(dateStrings);
      setDateRange(dateStrings);
      setfilterChanged(true)
    } else {
    }
  };

  const handleApplyFilters = (page = 1) => {
    if (!selectedMachineRedux && !selectedProductRedux && !selectedDefectRedux && !selectedShiftRedux) {
      resetFilter()
    }
    const params = {
      page: page, // Ensure this uses the provided page (default is 1)
      page_size: pagination.pageSize,
      plant_id: encryptAES(JSON.stringify(localPlantData?.id)) || undefined,
      from_date: dateRange?.[0] || undefined,
      to_date: dateRange?.[1] || undefined,
      machine_id: selectedMachineRedux || undefined,
      product_id: selectedProductRedux || undefined,
      defect_id: selectedDefectRedux,
      shift: selectedShiftRedux
    };

    // Filter out undefined or null values from query parameters
    const filteredQueryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );

    const encryptedUrl = Object.fromEntries(
      Object.entries(filteredQueryParams).map(([key, val]) => {
        if (key !== "page" && key !== "page_size" && key !== "plant_id") {
          if (key === "from_date" || key === "to_date") {
            return [key, encryptAES(val)];
          }
          return [key, encryptAES(JSON.stringify(val))];
        }
        return [key, val];
      })
    );

    const queryString = new URLSearchParams(encryptedUrl).toString();
    const url = `reports/?${queryString}`;

    setLoader(true);
    //console.log(url)

    apiCallInterceptor
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { results, total_count, page_size } = response.data;

        dispatch(getReportData({
          reportData: results,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total_count,
        }));
        setPagination((prev) => ({
          ...prev,
          current: page, // Update current page
          pageSize: page_size,
          total: total_count,
        })); setLoader(false);
        setfilterActive(true);
      })
      .catch((error) => {
        //console.error("Error fetching filtered reports data:", error);
        setLoader(false); // Ensure loader is stopped in case of error
      });
  };

  useEffect(() => {
    getDefects(localPlantData?.plant_name, accessToken, apiCallInterceptor)
  }, []);




  const downloadAllImages = async () => {
    //console.log((messages))
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
    const formattedTableData = reportData.map((item) => ({
      "Product Name": decryptAES(item.product),
      "Defect Name": decryptAES(item.defect),
      "Machine Name": decryptAES(item.machine),
      "Department Name": decryptAES(item.department),
      "Recorded Date Time": decryptAES(item.recorded_date_time).replace("T", " "),
      // "Image": decryptAES(item.image) ,
      "Image Link": {
        v: decryptAES(item.image), // Displayed text
        l: { Target: decryptAES(item.image), Tooltip: 'Click to view the image' } // Hyperlink
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

  const resetFilter = async () => {
    setfilterActive(false);
    setSelectedDate(null);
    dispatch(setSelectedMachine(null));
    dispatch(setSelectedProduct(null));
    dispatch(setSelectedDefectReports(null));
    dispatch(setSelectedShift(null))
    initialReportData()
    setPagination((prev) => ({ ...prev, current: 1, pageSize: 10, }))
    setfilterChanged(false)
  };

  const handleClickDownload = () => {
    socketConnection();
    setModal(true)
  }




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
          setfilterChanged(false)
        }}
        footer={[
          <>
            <Button key="submit" type="primary" style={{ backgroundColor: "#ec522d", }} onClick={handleDownload}>Download</Button>
          </>
        ]}
      >
        <div className="" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center" }}>

          <Select
            style={{ minWidth: "200px", marginRight: "10px", }}
            showSearch
            placeholder="Select Product"
            onChange={handleProductChange}
            value={selectedProductRedux}
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
            value={selectedDefectRedux}
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

          <RangePicker
            // showTime
            className="dx-default-date-range"
            ref={rangePickerRef}
            size="large"
            style={{ marginRight: "10px" }}
            onChange={handleDateRangeChange}
            allowClear={false}
            inputReadOnly={true}
            disabledDate={(current) => current && current.valueOf() > Date.now()}
            value={
              selectedDate
                ? [
                  dayjs(selectedDate[0], dateFormat),
                  dayjs(selectedDate[1], dateFormat),
                ]
                : []
            }
          />
        </div>

      </Modal >

      <div className="layout-content">
        <div
          className=""
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
        >
          <SelectComponent placeholder={"Select Product"} action={(val) => handleProductChange(val)} selectedData={selectedProductRedux} data={productsData} size={"large"} style={{ minWidth: "200px", marginRight: "10px", }} />

          <SelectComponent placeholder={"Select Machine"} action={(val) => handleMachineChange(val)} selectedData={selectedMachineRedux} data={machines} size={"large"} style={{ minWidth: "200px", marginRight: "10px" }} />

          <SelectComponent placeholder={"Select Defect"} action={(val) => handleDefectChange(val)} selectedData={selectedDefectRedux} data={defectsData} size={"large"} style={{ minWidth: "200px", marginRight: "10px" }} />

          <SelectComponent placeholder={"Select Shift"} selectedData={selectedShiftRedux} action={(val) => handleShiftChange(val)} data={shiftData} valueType="name" style={{ minWidth: "180px", zIndex: 1 }} size={"large"} />

          {/* <Select
            style={{ minWidth: "200px", marginRight: "10px" }}
            showSearch
            placeholder="Select Machine"
            value={selectedMachineRedux} // Set default value to 1 if selectedMachine is null
            onChange={handleMachineChange}
            size="large"
            filterOption={(input, machines) =>
              (machines.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {machines.map((machine) => (
              <Select.Option key={machine.id} value={machine.id}>
                {machine.name}
              </Select.Option>
            ))}
          </Select> */}

          {/* <Select
            style={{ minWidth: "200px", marginRight: "10px" }}
            showSearch
            placeholder="Select Product"
            onChange={handleProductChange}
            value={selectedProductRedux}
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
          </Select> */}

          {/* <Select
            style={{ minWidth: "200px", marginRight: "10px" }}
            showSearch
            placeholder="Select Defect"
            onChange={handleDefectChange}
            value={selectedDefectRedux}
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
          </Select> */}

          <RangePicker

            // showTime
            className="dx-default-date-range"
            size="large"
            style={{ marginRight: "10px" }}
            onChange={handleDateRangeChange}
            allowClear={false}
            inputReadOnly={true}
            disabledDate={(current) => current && current.valueOf() > Date.now()}
            value={
              selectedDate
                ? [
                  dayjs(selectedDate[0], dateFormat),
                  dayjs(selectedDate[1], dateFormat),
                ]
                : []
            }
          />

          <Button
            type="primary"
            disabled={!filterChanged}
            onClick={() =>
              handleApplyFilters()
            }
            style={{
              fontSize: "1rem",
              backgroundColor: "#ec522d",
              marginRight: "10px",
            }}
          >
            Apply filters
          </Button>


          {filterActive && filterChanged ? (
            <Button
              type="primary"
              onClick={resetFilter}
              style={{
                fontSize: "1rem",
                backgroundColor: "#ec522d",
                marginRight: "10px",
              }}
            >
              Reset Filter
            </Button>
          ) : null}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            style={{ fontSize: "1rem", backgroundColor: "#ec522d" }}
            onClick={downloadExcel}
          >
            Download Excel
          </Button>
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
              colors={[" #ec522d", "#ec522d"]}
            />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={reportData}
            pagination={pagination}
            locale={locale.Table}
            style={{ margin: "1rem 0", fontSize: "1.5rem" }}
            loading={loader}
            onChange={handleTableChange}
          />
        )}
      </div>
    </>
  );
};

export default Reports;