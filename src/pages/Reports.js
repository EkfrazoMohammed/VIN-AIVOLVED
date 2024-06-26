import React, { useState, useEffect } from 'react';
import { Table, Select, DatePicker, Button, Image, Tag } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import moment from 'moment';
import {API, AuthToken, baseURL, localPlantData} from "./../API/API"
import { ToastContainer, toast } from 'react-toastify';
import {
  VideoCameraOutlined,
  BugOutlined,
  AlertOutlined,
  RightOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Hourglass } from 'react-loader-spinner'
const { RangePicker } = DatePicker;



const Reports = () => {
  const localItems = localStorage.getItem("PlantData")
  const localPlantData = JSON.parse(localItems) 

  const columns = [
    { title: "Product Name", dataIndex: "product", key: "alert_name",id:"alert_name"  ,
      sorter: (a, b) => a.product.localeCompare(b.product),
      sortDirections: ['ascend','descend' ,'cancel'], },
    { title: "Defect Name", dataIndex: "defect", key: "defect_name" ,
      sorter: (a, b) => a.defect.localeCompare(b.defect),
      sortDirections: ['ascend','descend' ,'cancel'],

    },
    { title: "Machine Name", dataIndex: "machine", key: "machine_name",
      sorter: (a, b) => a.machine.localeCompare(b.machine),
      sortDirections: ['ascend','descend' ,'cancel'],

     },
    {
      title: "Department Name",
      dataIndex: "department",
      key: "department_name",
      sorter: (a, b) => a.department.localeCompare(b.department),
      sortDirections: ['ascend','descend' ,'cancel'],
    },
    {
      title: "Recorded Date Time",
      dataIndex: "recorded_date_time",
      // key: "recorded_date_time",
      render: (text) => <a>{(text).split("T").join(" , ")}</a>,

    },
    { title: "Plant Name", dataIndex: "plant", key: "plant" ,
      sorter: (a, b) => a.plant.localeCompare(b.plant),
      sortDirections: ['ascend','descend' ,'cancel'],

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
      sortTitle: 'Sort',
        triggerAsc: 'Click to sort in ascending order by defect name',
        triggerDesc: 'Click to sort in descending order by defect name',
      cancelSort: 'Click to cancel sorting',
    },
  };
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const formattedStartDate = startDate.toISOString().slice(0, 10); // Format startDate as YYYY-MM-DD
  
  const endDate = new Date(); // Today's date
  const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD
  
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDefect, setselectedDefect] = useState(null);
  const [selectedProduct, setselectedProduct] = useState(null);
  const [dateRange, setDateRange] = useState([formattedStartDate, formattedEndDate]);
  const [tableData, setTableData] = useState([]);

  const [productOptions, setProductOptions] = useState([]);
  const [loader,setLoader] = useState(false)


  const handleProductChange = value => {
    setselectedProduct(value);
  };
  const handleMachineChange = value => {
    setSelectedMachine(value);
  };

  const handleDepartmentChange = value => {
    setSelectedDepartment(value);
  };

  const handleDateRangeChange = (dates, dateStrings) => {
    if (dateStrings) {
      console.log(dateStrings)
      setDateRange(dateStrings);
    } else {
      console.error('Invalid date range:', dates,dateStrings);
    }
  };
  
  const handleApplyFilters = () => {
    const domain = `${baseURL}`;
    const [fromDate, toDate] = dateRange;
    let url = `${domain}reports/?`;
    // url += `machine=${selectedMachine}&department=${selectedDepartment}`;
    // url += `?plant_id=${localPlantData.id}&from_date=${fromDate}&to_date=${toDate}&machine_id=${selectedMachine}&department_id=${selectedDepartment}&product_id=${selectedProduct}&defect_id=${selectedDefect}`;
    // if (fromDate && toDate) {
    //   url += `&from_date=${fromDate}&to_date=${toDate}`;
    // }
    if (localPlantData.id) {
      url += `plant_id=${localPlantData.id}&`;
  }
  if (fromDate) {
      url += `from_date=${fromDate}&`;
  }
  if (toDate) {
      url += `to_date=${toDate}&`;
  }
  if (selectedMachine) {
      url += `machine_id=${selectedMachine}&`;
  }
  if (selectedDepartment) {
      url += `department_id=${selectedDepartment}&`;
  }
  if (selectedProduct) {
      url += `product_id=${selectedProduct}&`;
  }
  if (selectedDefect) {
      url += `defect_id=${selectedDefect}&`;
  }
  
  // Remove the trailing '&' if present
  if (url.endsWith('&')) {
      url = url.slice(0, -1);
  }
  
  // If no filters are added, remove the trailing '?'
  if (url.endsWith('?')) {
      url = url.slice(0, -1);
  }

    axios.get(url,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setTableData(response.data.results);
        setfilterActive(true)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const { RangePicker } = DatePicker;

  const [machineOptions, setMachineOptions] = useState([]);
  const [filterActive ,setfilterActive] = useState(false);

  

  const getMachines=()=>{
    const domain = `${baseURL}`;
    let url = `${domain}machine/?plant_name=${localPlantData.plant_name}`;
    axios.get(url,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    })
      .then(response => {
        const formattedMachines = response.data.results.map(machine => ({
          id: machine.id,
          name: machine.name,
        }));
        setMachineOptions(formattedMachines);
      })
      .catch(error => {
        console.error('Error fetching machine data:', error);
      });
  }
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const getDepartments=()=>{
    const domain = `${baseURL}`;
    let url = `${domain}department/?plant_name=${localPlantData.plant_name}`;
    axios.get(url,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    })
      .then(response => {
        const formattedDepartment = response.data.results.map(department => ({
          id: department.id,
          name: department.name,
        }));
        setDepartmentOptions(formattedDepartment);
      })
      .catch(error => {
        console.error('Error fetching machine data:', error);
      });
  }
  
  const initialDateRange = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // 7 days ago
    const formattedStartDate = startDate.toISOString().slice(0, 10); // Format startDate as YYYY-MM-DD
    
    const endDate = new Date(); // Today's date
    const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD
    
    setDateRange([formattedStartDate, formattedEndDate]);
  };

  const initialTableData = () => {
    // const domain = `http://143.110.184.45:8100/`;
    setLoader(true)
   const url = `${baseURL}reports/?plant_id=${localPlantData.id}`;
    axios.get(url,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    })
      .then(response => {
        setTableData(response.data.results);
        setLoader(false)
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const prodApi = ()=>{
    const domain = `${baseURL}`;
    const url = `${domain}product/?plant_name=${localPlantData.plant_name}`;
    axios.get(url,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    }).then((res)=>{
console.log(res.data,"prod")
   setProductOptions(res.data.results)
    })  
    .catch((err)=>{
      console.log(err)
    })
  }
  
  useEffect(() => {
    getDepartments()
    getMachines();
    initialDateRange()
    initialTableData();
   prodApi()
  }, []); 

  const downloadExcel = () => {
  
    // Convert JSON to Excel
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Save Excel file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const s2ab = (s) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    };

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
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

  const [notifications, setNotifications] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [prevNotificationLength, setPrevNotificationLength] = useState(0);
  
  
  
  const initializeWebSocket = () => {
    const socket = new WebSocket(`wss://hul.aivolved.in/ws/notifications/`);
  
    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsSocketConnected(true); // Update connection status
    };
  
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setNotifications(prevNotifications => {
        const newNotifications = [...prevNotifications, message.notification];
        // toast.error(message.notification); // Display toast notification
        toast.error(message.notification, 
          {
            position: "top-right",
            // autoClose: false,
            autoClose:10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: { whiteSpace: 'pre-line' },  // Added style for new line character
            // transition: Bounce,
            }
        ); // Display toast notification with 5 seconds duration
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
  
const resetFilter = ()=>{
  initialTableData()
  setfilterActive(false)
}

    return (
      
      <>
       {/* <ToastContainer /> */}

    
    <div className="layout-content">
      
      <Select
  style={{ minWidth: "200px", marginRight: "10px" }}
  showSearch
  placeholder="Select Machine"
  defaultValue={selectedMachine} // Set default value to 1 if selectedMachine is null
  onChange={handleMachineChange}
  size="large"
  filterOption={(input,machineOptions)=>

    (machineOptions.children ?? "").toLowerCase().includes(input.toLowerCase())
  }
>
{machineOptions.map(machine => (
    <Select.Option key={machine.id} value={machine.id}>{machine.name}</Select.Option>
  ))}
</Select>

      <Select
        style={{ minWidth: "200px", marginRight: "10px" }}
        showSearch
        placeholder="Select Product"
        onChange={handleProductChange}
        defaultValue={selectedProduct}
        size="large"
        filterOption={(input,productOptions)=>
        // ( productOptions.children ?? "".toLowerCase() ).includes(input.toLowerCase() )
       ( productOptions.children ?? "").toLowerCase().includes(input.toLowerCase())

        }
      >
        {productOptions.map(department => (
          <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
        ))}
      </Select>
      <RangePicker
          size="large"
        style={{ marginRight: "10px" }}
        onChange={handleDateRangeChange}
          
      />
   
      <Button type="primary" onClick={handleApplyFilters} style={{fontSize:"1rem",backgroundColor:"#ec522d",marginRight:"10px"}}>Apply filters</Button>
      {filterActive ? 
      <Button type="primary" onClick={resetFilter} style={{fontSize:"1rem",backgroundColor:"#ec522d",marginRight:"10px"}}>Reset Filter</Button>
      :null}
      <Button type="primary" icon={<DownloadOutlined />} size='large' style={{fontSize:"1rem",backgroundColor:"#ec522d"}} onClick={downloadExcel}>
            Download
          </Button>
          {
            loader ? <div className="" style={{height:"60vh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:" rgba(0, 0, 0, 0.24) 0px 3px 8px",marginTop:'1rem',borderRadius:"10px"}}>
              <Hourglass
  visible={true}
  height="40"
  width="40"
  ariaLabel="hourglass-loading"
  wrapperStyle={{}}
  wrapperClass=""
  colors={[' #ec522d', '#ec522d']}
  />
            </div> : 
      <Table
      columns={columns}
      dataSource={tableData}
      pagination={{
        position: ['topRight'],
        currentPage:2,
        showSizeChanger:true,
      }}
      locale={locale.Table }
      style={{ margin: "1rem 0", fontSize: "1.5rem" }}
    />
    
        

          }
      {/* <Table columns={columns} dataSource={tableData}  style={{margin:"1rem 0",fontSize:"1.5rem"}}/> */}
    </div>
    </>
  );
};

export default Reports;
