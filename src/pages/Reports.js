import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Table, Select, DatePicker, Button, Image, Tag } from "antd";
import * as XLSX from "xlsx";
import axiosInstance from "../API/axiosInstance";
import { DownloadOutlined } from "@ant-design/icons";
import { Hourglass } from "react-loader-spinner";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { getReportData, updatePage } from ".././redux/slices/reportSlice";

// REPORTS API CALLING
import { reportApi } from "../services/reportsApi";





// import {API, AuthToken, baseURL, localPlantData} from "./../API/API"
// import { baseURL } from "./../API/API";
// import moment from "moment";
// import useApiInterceptor from "../hooks/useInterceptor";
// const { RangePicker } = DatePicker;

const columns = [
  {
    title: "Product Name",
    dataIndex: "product",
    key: "alert_name",
    id: "alert_name",
    sorter: (a, b) => a.product.localeCompare(b.product),
    sortDirections: ["ascend", "descend", "cancel"],
  },
  {
    title: "Defect Name",
    dataIndex: "defect",
    key: "defect_name",
    sorter: (a, b) => a.defect.localeCompare(b.defect),
    sortDirections: ["ascend", "descend", "cancel"],
  },
  {
    title: "Machine Name",
    dataIndex: "machine",
    key: "machine_name",
    sorter: (a, b) => a.machine.localeCompare(b.machine),
    sortDirections: ["ascend", "descend", "cancel"],
  },
  {
    title: "Department Name",
    dataIndex: "department",
    key: "department_name",
    sorter: (a, b) => a.department.localeCompare(b.department),
    sortDirections: ["ascend", "descend", "cancel"],
  },
  {
    title: "Recorded Date Time",
    dataIndex: "recorded_date_time",
    key: "recorded_date_time",
    // render: (text) => <a>{text.split("T").join(" , ")}</a>,
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image_b64) =>
      image_b64 ? (
        <Image src={image_b64} alt="Defect Image" width={50} />
      ) : null,
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


  // REDUX CALLING
  const dispatch = useDispatch()
  const reportData = useSelector((state) => state.report.reportData);
  const pagination = useSelector((state) => state.report.pagination);
  const localPlantData = useSelector((state) => state.plant.plantData);
  const plantName = localPlantData ? localPlantData.plant_name : "";
  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );


  const dateFormat = "YYYY/MM/DD";
  const location = useLocation();


  const defectProp = location?.state?.clickedVal[0]?.name || null;
  const defectId = location?.state?.clickedVal[0]?.id || null;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const formattedStartDate = startDate.toISOString().slice(0, 10); // Format startDate as YYYY-MM-DD
  const endDate = new Date(); // Today's date
  const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDefect, setselectedDefect] = useState(defectId || null);
  const [selectedProduct, setselectedProduct] = useState(null);
  const [dateRange, setDateRange] = useState();
  const [tableData, setTableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { RangePicker } = DatePicker;
  const [machineOptions, setMachineOptions] = useState([]);
  const [defectsOptions, setDefectsOptions] = useState([]);
  const [filterActive, setfilterActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [prevNotificationLength, setPrevNotificationLength] = useState(0);



  const [productOptions, setProductOptions] = useState([]);

  const [plantTableDetail, setPlantTableDetail] = useState([
    {
      product: "",
      defect: "",
      machine: "",
      department: "",
      recorded_date_time: "",
      image: "",
    },
  ]);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    reportApi({ plantId: 3, pageSize: pagination.pageSize, Authtoken: accessToken, pageNumber: pagination.current })
      .then(res => {
        const { page_size, total_count, results } = res;
        dispatch(getReportData({
          reportData: results,
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: total_count,
        }));
      })
      .catch(err => console.error(err));
  }, [pagination.current, pagination.pageSize, accessToken]);


  const handleTableChange = (pagination) => {
    dispatch(updatePage({
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const handleProductChange = (value) => {
    setselectedProduct(value);
  };

  const handleDefectChange = (value) => {
    setselectedDefect(value);

  };
  const handleMachineChange = (value) => {
    setSelectedMachine(value);

  };



  const handleDateRangeChange = (dates, dateStrings) => {
    if (dateStrings) {
      setSelectedDate(dateStrings);
      setDateRange(dateStrings);
    } else {
      console.error("Invalid date range:", dates, dateStrings);
    }
  };

  const handleApplyFilters = (page, pageSize) => {
    // Initialize URLSearchParams
    const params = new URLSearchParams({
      page: 1,
      page_size: pageSize,
      plant_id: localPlantData?.id || undefined,
      from_date: dateRange?.[0] || undefined,
      to_date: dateRange?.[1] || undefined,
      machine_id: selectedMachine || undefined,
      department_id: selectedDepartment || undefined,
      product_id: selectedProduct || undefined,
      defect_id: selectedDefect || undefined,
    });

    // Construct the final URL
    const url = `reports/?${params.toString()}`;

    // Set loader to true before making the API call
    setLoader(true);

    // Make the API call using axiosInstance
    axiosInstance
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { results, total_count, page_size } = response.data;

        setTableData(results);
        setLoader(false);
        setfilterActive(true);

      })
      .catch((error) => {
        console.error("Error fetching filtered reports data:", error);
        setLoader(false); // Ensure loader is stopped in case of error
      });
  };



  const getMachines = () => {
    if (!plantName) {
      console.error("Plant name is missing");
      return;
    }

    const url = `machine/?plant_name=${plantName}`;

    axiosInstance
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const formattedMachines = response.data.results.map((machine) => ({
          id: machine.id,
          name: machine.name,
        }));
        setMachineOptions(formattedMachines);
      })
      .catch((error) => {
        console.error("Error fetching machine data:", error);
      });
  };

  const getDefects = () => {
    const url = `defect/?plant_name=${plantName}`;
    axiosInstance
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const formattedDefects = response.data.results.map((defect) => ({
          id: defect.id,
          name: defect.name,
        }));

        console.log("getDefects response:", response);

        setDefectsOptions(formattedDefects);
      })
      .catch((error) => {
        console.error("Error fetching defect data:", error);
      });
  };

  const [departmentOptions, setDepartmentOptions] = useState([]);

  const getDepartments = () => {
    const url = `department/?plant_name=${plantName}`;
    axiosInstance
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const formattedDepartment = response.data.results.map((department) => ({
          id: department.id,
          name: department.name,
        }));
        setDepartmentOptions(formattedDepartment);
      })
      .catch((error) => {
        console.error("Error fetching department data:", error);
      });
  };

  const initialTableData = () => {
    setLoader(true);
    axiosInstance
      .get(`machine/?plant_name=${plantName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const { results, total_count, page_size } = response.data;

        setTableData(results);
        setLoader(false);

      })
      .catch((error) => {
        console.error("Error fetching table data:", error);
        setLoader(false);
      });
  };

  const prodApi = () => {
    const url = `product/?plant_name=${plantName}`;

    axiosInstance
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setProductOptions(res.data.results);
      })
      .catch((err) => {
        console.error("Error fetching product data:", err);
      });
  };

  useEffect(() => {
    getDepartments();
    getMachines();
    getDefects();
    // if (defectProp) {
    //   handleApplyFilters(pagination.current, pagination.pageSize);
    // } else {
    //   initialTableData(pagination.current, pagination.pageSize);
    // }
    // initialDateRange()
    prodApi();
  }, []);

  const downloadExcel = () => {
    // Convert JSON to Excel
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

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
    a.download = "data.xlsx";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  // const handleTableChange = (pagination) => {
  //   dispatch(updatePage({
  //     current: pagination.current,
  //   }));
  // };

  // const handleTableChange = (pagination) => {
  //   setPagination({
  //     ...pagination,
  //     pageSize: pagination.pageSize,
  //   });

  //   if (filterActive) {
  //     handleApplyFilters(pagination.current, pagination.pageSize);
  //   } else {
  //     initialTableData(pagination.current, pagination.pageSize);
  //   }
  // };

  const initializeWebSocket = () => {
    const socket = new WebSocket(`wss://hul.aivolved.in/ws/notifications/`);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsSocketConnected(true); // Update connection status
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setNotifications((prevNotifications) => {
        const newNotifications = [...prevNotifications, message.notification];
        // toast.error(message.notification); // Display toast notification
        toast.error(message.notification, {
          position: "top-right",
          // autoClose: false,
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          style: { whiteSpace: "pre-line" }, // Added style for new line character
          // transition: Bounce,
        }); // Display toast notification with 5 seconds duration
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

  useEffect(() => {
    const cleanupWebSocket = initializeWebSocket();
    return cleanupWebSocket;
  }, []);

  useEffect(() => {
    if (notifications.length > prevNotificationLength) {
      setPrevNotificationLength(notifications.length);
    }
  }, [notifications]);

  const resetFilter = () => {
    // initialTableData(pagination.current, pagination.pageSize);
    setfilterActive(false);
    setselectedDefect(null);
    setSelectedMachine(null);
    setselectedProduct(null);
    setSelectedDate(null);
    // setPagination({
    //   ...pagination,
    //   current: 1,
    // });
  };

  return (
    <>
      {/* <ToastContainer /> */}

      <div className="layout-content">
        <div
          className=""
          style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}
        >
          <Select
            style={{ minWidth: "200px", marginRight: "10px" }}
            showSearch
            placeholder="Select Machine"
            value={selectedMachine} // Set default value to 1 if selectedMachine is null
            onChange={handleMachineChange}
            size="large"
            filterOption={(input, machineOptions) =>
              (machineOptions.children ?? "")
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
            style={{ minWidth: "200px", marginRight: "10px" }}
            showSearch
            placeholder="Select Product"
            onChange={handleProductChange}
            value={selectedProduct}
            size="large"
            filterOption={(input, productOptions) =>
              // ( productOptions.children ?? "".toLowerCase() ).includes(input.toLowerCase() )
              (productOptions.children ?? "")
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
          <Select
            style={{ minWidth: "200px", marginRight: "10px" }}
            showSearch
            placeholder="Select Defect"
            onChange={handleDefectChange}
            value={selectedDefect}
            size="large"
            filterOption={(input, defectsOptions) =>
              // ( productOptions.children ?? "".toLowerCase() ).includes(input.toLowerCase() )
              (defectsOptions.children ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {defectsOptions.map((department) => (
              <Select.Option key={department.id} value={department.id}>
                {department.name}
              </Select.Option>
            ))}
          </Select>

          <RangePicker
            // showTime
            size="large"
            style={{ marginRight: "10px" }}
            onChange={handleDateRangeChange}
            allowClear={false}
            inputReadOnly={true}
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
          {filterActive ? (
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
            Download
          </Button>
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
            // pagination={{
            //   position: ['topRight'],
            //   currentPage:2,
            //   showSizeChanger:true,
            // }}
            pagination={pagination}
            locale={locale.Table}
            style={{ margin: "1rem 0", fontSize: "1.5rem" }}
            loading={loader}
            onChange={handleTableChange}
          />
        )}
        {/* <Table columns={columns} dataSource={tableData}  style={{margin:"1rem 0",fontSize:"1.5rem"}}/> */}
      </div>
    </>
  );
};

export default Reports;
