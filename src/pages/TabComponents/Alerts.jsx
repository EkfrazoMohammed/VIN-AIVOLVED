import React ,{useMemo, useState,useEffect} from 'react';
import {Button, Select ,Space, Card, Col, Row ,ColorPicker,Table, Tag, Form, Input, Radio, notification, Descriptions } from 'antd';
import { Switch } from 'antd';
import axios from "axios";
import { useSelector } from 'react-redux';
// import {API, AuthToken, baseURL, localPlantData} from "./../API/API"
import {baseURL} from "../../API/API"

import {  EditOutlined} from '@ant-design/icons';
import Alerts from './Settings';

const Alert = () => {
 // const localItems = localStorage.getItem('PlantData');
  // const localPlantData = JSON.parse(localItems);
  
  const localPlantData = useSelector((state) => state.plant.plantData);
  const AuthToken = useSelector((state) => state.auth.authData.access_token);

    const [tableData,setTableData]=useState([])
// Table Columns
const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,

    },
    {
        title: 'Product ',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },


  ];
useEffect(()=>{
    const url = `${baseURL}product/?plant_name=${localPlantData.plant_name}`
    axios.get(url,{
      headers:{
        Authorization:`Bearer ${AuthToken}`
      }
    })
    .then(res =>
        setTableData(res.data.results)
    )
    .catch(err=> console.log(err))
    
    },[]);

  const [api, contextHolder] = notification.useNotification();

  // COLOR PICKER USESTATE
  const [color, setColor] = useState("#561ecb");

// FORM STATE
  const [form] = Form.useForm();

// State Values
const [data,setData] = useState();

  // POST METHOD FOR SENDING COLOR CODE
  const handlePost = (param)=>{
if(data === '' || data === undefined || data === null){
  return (
    api.open({
      message: 'Please Fill out required Fields',
      placement:'top',
           })
  )
}
    const payload = {
      "name": data,
    }
    
    const PostData = async()=>{
        const url = `${baseURL}alerts`
      const res = await axios.post(`${url}/`,payload)
      try{
        api.open({
          message: `Alert created`,
          placement:'top',
               });
      }
      catch(err){
        console.log(err)
      }

    }
    PostData()
  }


const handleChange = useMemo(
  ()=>(typeof color === "string" ? color:color?.toHexString()),
  [color],
);
  return (
<>
{contextHolder}


{/* <Row gutter={24} style={{margin:'2rem 0',display:'flex',flexDirection:'column'}}>
  <Col>
  <h5 style={{fontWeight:650}}>
    Create Department <EditOutlined /></h5>
    

    </Col>
  <Col style={{margin:'1rem'}}>

  <Form
      layout='inline'
      form={form}
      size= 'large'
      variant="filled"
      
    >

      <Form.Item label={<h6>Department Name</h6>} >
        <Input placeholder="Enter Department Name"  onChange={(e)=>setData(e.target.value)} />
      </Form.Item>
      <Form.Item >
        <Button style={{background:'#EC522D',color:'#fff'}} onClick={()=>handlePost('department')}>Create Alerts</Button>
      </Form.Item>
    </Form>
  
  
  </Col>
</Row> */}
<Table columns={columns} dataSource={tableData} pagination={{ pageSize: 6 }} />
</>
  )
}

export default Alert