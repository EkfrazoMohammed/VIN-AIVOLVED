
import React, { useState, useEffect } from 'react';
import { Table, Select, DatePicker, Button, Image, Tag } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {API, baseURL} from "./../API/API"
import moment from 'moment';
import {
  VideoCameraOutlined,
  BugOutlined,
  AlertOutlined,
  RightOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { render } from '@testing-library/react';
const { RangePicker } = DatePicker;

const Insights = () => {
 

  const columns = [
    { title: 'Notification Text', dataIndex: 'notification_text', key: 'notification_text', responsive: ['md'], render:(text)=> <div className="" style={{whiteSpace:"pre-line"}}>{text}</div> },
    { title: 'RCA 1', dataIndex: 'rca1', key: 'rca1', responsive: ['lg'],  render:(text)=> <div className="" style={{whiteSpace:"pre-line"}}>{text}</div>},
    { title: 'RCA 2', dataIndex: 'rca2', key: 'rca2' , responsive: ['lg'], render:(text)=> <div className="" style={{whiteSpace:"pre-line"}}>{text}</div>},
    { title: 'RCA 3', dataIndex: 'rca3', key: 'rca3', responsive: ['lg'], render:(text)=> <div className="" style={{whiteSpace:"pre-line"}}>{text}</div> },
    { title: 'RCA 4', dataIndex: 'rca4', key: 'rca4' , responsive: ['lg'], render:(text)=> <div className="" style={{whiteSpace:"pre-line"}}>{text}</div>},
    { title: 'RCA 5', dataIndex: 'rca5', key: 'rca5', responsive: ['lg'], render:(text)=> <div className="" style={{whiteSpace:"pre-line"}}>{text}</div> },
    { title: 'RCA 6', dataIndex: 'rca6', key: 'rca6', responsive: ['lg'], render:(text)=> <div className="" style={{whiteSpace:"pre-line"}}>{text}</div> },
    { title: 'Recorded Date & Time', dataIndex: 'recorded_date_time', key: 'recorded_date_time', responsive: ['md'], render:(text)=> <div className="" style={{whiteSpace:"pre-line"}}>{text}</div> },
    { title: 'Defect', dataIndex: 'defect', key: 'defect', responsive: ['lg'], },
  ];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7); // 7 days ago
  const formattedStartDate = startDate.toISOString().slice(0, 10); // Format startDate as YYYY-MM-DD
  
  const endDate = new Date(); // Today's date
  const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD
  
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [dateRange, setDateRange] = useState([formattedStartDate, formattedEndDate]);
  const [tableData, setTableData] = useState([]);

  const handleMachineChange = value => {
    setSelectedMachine(value);
  };
  console.log(tableData,",,,,")

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
    url += `machine=${selectedMachine}&department=${selectedDepartment}`;
    if (fromDate && toDate) {
      url += `&from_date=${fromDate}&to_date=${toDate}`;
    }
    axios.get(url)
      .then(response => {
        setTableData(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const { RangePicker } = DatePicker;

  const [machineOptions, setMachineOptions] = useState([]);
  const getMachines=()=>{
    const domain = `${baseURL}`;
    let url = `${domain}machine/?`;
    axios.get(url)
      .then(response => {
        const formattedMachines = response.data.map(machine => ({
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
    let url = `${domain}department/?`;
    axios.get(url)
      .then(response => {
        const formattedDepartment = response.data.map(department => ({
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
    const domain = `http://localhost:8010/`;
   const url = `${baseURL}defect-notifications/`;
    axios.get(url)
      .then(response => {
        setTableData(response.data.results);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  console.log(tableData,"<<<<")
  useEffect(() => {
    getDepartments()
    getMachines();
    initialDateRange()
    initialTableData();
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
  return (
    <div className="layout-content">
      
      {/* <Select
  style={{ minWidth: "200px", marginRight: "10px" }}
  showSearch
  placeholder="Select Machine"
  defaultValue={selectedMachine} // Set default value to 1 if selectedMachine is null
  onChange={handleMachineChange}
  size="large"
>
{machineOptions.map(machine => (
    <Select.Option key={machine.id} value={machine.id}>{machine.name}</Select.Option>
  ))}
</Select>

      <Select
        style={{ minWidth: "200px", marginRight: "10px" }}
        showSearch
        placeholder="Select Department"
        onChange={handleDepartmentChange}
        defaultValue={selectedDepartment}
        size="large"
      >
        {departmentOptions.map(department => (
          <Select.Option key={department.id} value={department.id}>{department.name}</Select.Option>
        ))}
      </Select>
      <RangePicker
          size="large"
        style={{ marginRight: "10px" }}
        onChange={handleDateRangeChange}
          
      />
   
      <Button type="primary" onClick={handleApplyFilters} style={{fontSize:"1rem",backgroundColor:"#ec522d",marginRight:"10px"}}>Apply filters</Button>
      <Button type="primary" icon={<DownloadOutlined />} size='large' style={{fontSize:"1rem",backgroundColor:"#ec522d"}} onClick={downloadExcel}>
            Download
          </Button> */}
      <Table columns={columns} dataSource={tableData}  
    //   scroll={{ x: 800, y: 410 }}
      style={{margin:"1rem 0"}}/>
    </div>
  );
};

export default Insights;