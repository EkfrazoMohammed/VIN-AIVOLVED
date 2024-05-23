import React, { useState, useEffect } from 'react';
import { Table, Select, DatePicker, Button, Image, Tag } from 'antd';
import axios from 'axios';
import * as XLSX from 'xlsx';
import moment from 'moment';
import {
  VideoCameraOutlined,
  BugOutlined,
  AlertOutlined,
  RightOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;

const MachinesParameter = () => {

  
const [data,setData]=useState([])
  const getData=async ()=>{
    await axios.get("http://vin.aivolved.in:8100/machine_temprature/")
    .then((res)=>{
      console.log(res.data)
      setData(res.data)
    }).catch((err)=>{
      console.log(err)
    })
  }
  useEffect(() => {
    getData();  
  }, []); 

 
  return (
    <div className="layout-content">
     

      <div className="machineParameterContainer">
     
        {data.map((item) => (
                <div className='mycardContainer' key={item.id}>
                    <div className="cardUpper">
                        <div className='cardHeading'>
                            Machine {item.machine}
                        </div>
                    </div>
                    <div className="cardBottom">
                        <div className='firstLine'>
                            <div className='columnData'>
                                <div className='columnDataHeading'>Horizontal</div>
                                <div className='columnDataValue'>{item.horizontal}</div>
                            </div>
                            <div className='columnData'>
                                <div className='columnDataHeading'>Teeth</div>
                                <div className='columnDataValue'>{item.teeth.toString()}</div>
                            </div>
                            <div className='columnData'>
                                <div className='columnDataHeading'>coder</div>
                                <div className='columnDataValue'>{item.coder.toString()}</div>
                            </div>
                        </div>
                        <div className='secondLine'>
                            <div className='secondLinecolumnData'>
                                <div className='secondLinecolumnDataHeading'>Vertical</div>
                                {JSON.parse(item.vertical).map((value, index) => (
                                    <div key={index} className='secondLinecolumnDataValue'>{value}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
      </div>
   
    </div>
  );
};

export default MachinesParameter;
