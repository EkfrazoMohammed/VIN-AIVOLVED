import React ,{useMemo, useState,useEffect} from 'react';
import {Button, Select ,Space, Card, Col, Row ,ColorPicker,Table, Tag, Form, Input, Radio, notification, Descriptions } from 'antd';
import { Switch } from 'antd';
import axios from "axios";

import {  EditOutlined} from '@ant-design/icons';
import { AuthToken, baseURL } from '../../API/API';
import useApiInterceptor from '../../hooks/Interceptor';


const Departments = () => {
  const apicallInterceptor = useApiInterceptor();
  const localItems = localStorage.getItem("PlantData")
  const localPlantData = JSON.parse(localItems) 

    const [tableData,setTableData]= useState()
// Table Columns
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        id: 'id',
        render: (text) => <a>{text}</a>,
      },
    {
      title: 'Department',
      dataIndex: 'name',
      id: 'name',
      render: (text) => <a>{text}</a>,
    },


  ];

  useEffect(()=>{
    const url = `department/?plant_name=${localPlantData.plant_name}`

    const getDepartmentData = async()=>{
      try {
        const response =  await apicallInterceptor.get(url)
        setTableData(response.data.results)
      } catch (error) {
        console.log(error)
      }
    }
    getDepartmentData();
    // axios.get(url,{
    //   headers:{
    //     Authorization:`Bearer ${AuthToken}`
    //   }
    // })
    // .then(res =>
    //     setTableData(res.data.results)
    // )
    // .catch(err=> console.log(err))
    
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
    console.log(data)
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
        const url = `department`
      
      const res = await apicallInterceptor.post(`${url}/`,payload)
      try{
        api.open({
          message:`Department created`,
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
console.log(data)
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
        <Button style={{background:'#EC522D',color:'#fff'}} onClick={()=>handlePost('department')}>Create Department</Button>
      </Form.Item>
    </Form>
  
  
  </Col>
</Row> */}
<Table columns={columns} dataSource={tableData} pagination={{ pageSize: 6 }}/>

</>
  )
}

export default Departments;