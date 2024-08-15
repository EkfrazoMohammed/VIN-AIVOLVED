import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Table, Select, DatePicker, Button, Image, Tag } from "antd";
import * as XLSX from "xlsx";
import axiosInstance from "../API/axiosInstance";
import { DownloadOutlined } from "@ant-design/icons";
import { Hourglass } from "react-loader-spinner";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSelector,useDispatch } from "react-redux";
import { initialDashboardData, getDefects,getMachines, getSystemStatus, getDepartments, initialDpmuData, initialProductionData, getProducts } from "./../services/dashboardApi";
import { reportApi } from "./../services/reportsApi";
import {
  setSelectedDefect,
} from "../redux/slices/defectSlice"; // Import the actions

import { getReportData, updatePage } from ".././redux/slices/reportSlice";
import { setSelectedMachine } from "../redux/slices/machineSlice"
import { setSelectedProduct } from "../redux/slices/productSlice"

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
  const localPlantData = useSelector((state) => state.plant.plantData[0]);
  const accessToken = useSelector(
    (state) => state.auth.authData[0].accessToken
  );
  const machines = useSelector((state) => state.machine.machinesData)
  const defectsData = useSelector((state) => state.defect.defectsData)
  const productsData = useSelector((state) => state.product.productsData)
  const selectedMachineRedux = useSelector((state) => state.machine.selectedMachine);
  const selectedProductRedux = useSelector((state) => state.product.selectedProduct);
  const selectedDefectRedux = useSelector((state) => state.defect.selectedDefect);


  const dateFormat = "YYYY/MM/DD";
  const location = useLocation();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const endDate = new Date(); // Today's date
  const [dateRange, setDateRange] = useState();
  const [tableData, setTableData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const { RangePicker } = DatePicker;
  const [filterActive, setfilterActive] = useState(false);

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

  
  const handleDefectChange = (value) => {
    dispatch(setSelectedDefect(Number(value)))
  };

  const handleMachineChange = (value) => {
    dispatch(setSelectedMachine(Number(value))); // Dispatching action    
  };

  const handleProductChange = (value) => {
    dispatch(setSelectedProduct(Number(value))); // Dispatching action    
  }



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
      machine_id: selectedMachineRedux || undefined,

      product_id: selectedProductRedux || undefined,
      defect_id: selectedDefectRedux || undefined,
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
  console.log(localPlantData)

  useEffect(() => {
    getDefects(localPlantData?.plant_name,accessToken) 
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


  const resetFilter = () => {

    setfilterActive(false);
    setSelectedDate(null);
    dispatch(setSelectedMachine(null)); // Dispatching action    
    dispatch(setSelectedProduct(null)); // Dispatching action 

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
          </Select>

          <Select
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
          </Select>
          <Select
            style={{ minWidth: "200px", marginRight: "10px" }}
            showSearch
            placeholder="Select Defect"
            onChange={handleDefectChange}
            // value={selectedDefectRedux}
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
