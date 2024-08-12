
import React, { useState, useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Table, Select, DatePicker, Button, Image, Tag } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import {API, baseURL} from "./../API/API"
import { Hourglass } from 'react-loader-spinner';
const { RangePicker } = DatePicker;

const Insights = () => {
  const [loader,setLoader] = useState(false)

  // const localItems = localStorage.getItem("PlantData")
  // const localPlantData = JSON.parse(localItems) 

    // const localItems = localStorage.getItem("PlantData")
  // const localPlantData = JSON.parse(localItems) 
  const localPlantData = useSelector((state) => state.plant.plantData);
  const AuthToken = useSelector((state) => state.auth.authData.access_token);
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
  
  const [tableData, setTableData] = useState([]);

  return (
    <div className="layout-content">
      
   
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
          <Table columns={columns} dataSource={tableData}  
           style={{margin:"1rem 0"}}/>
          }
    </div>
  );
};

export default Insights;