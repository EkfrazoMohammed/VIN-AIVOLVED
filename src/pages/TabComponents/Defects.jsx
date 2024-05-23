import React ,{useEffect, useMemo, useState} from 'react';
import {Button, Select ,Space, Card, Col, Row ,ColorPicker,Table, Tag, Form, Input, Radio, notification, Descriptions } from 'antd';
import { Switch } from 'antd';
import axios from "axios";

import {  EditOutlined} from '@ant-design/icons';
import { baseURL } from '../../API/API';


const Defects = () => {

// Table Columns
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        id: 'id',
        render: (text) => <a>{text}</a>,
      },
    {
      title: 'Defect Name',
      dataIndex: 'name',
      id: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Color ',
      dataIndex: 'color_code',
      id: 'color_code',
      render:(col)=><div className="" style={{height:"40px",width:'40px',borderRadius:'20px',background:`${col}`}}></div>
    },
    {
      title: 'Color Code ',
      dataIndex: 'color_code',
      id: 'color_code',
    },

  ];
// Table  Data 



const [api, contextHolder] = notification.useNotification();
const [tableData,setTableData] = useState([])

useEffect(()=>{
const url = `${baseURL}defect`
axios.get(url)
.then(res =>
    setTableData(res.data)
)
.catch(err=> console.log(err))

},[]);

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
        const url = `${baseURL}defect`

    //   const res = await axios.post(`http://143.110.184.45:8100/${param}/`,payload)
      const res = await axios.post(`${url}/`,payload)
      try{
        api.open({
          message: `Defect created`,
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

const limitedDataSource = tableData.slice(0, 5);
  return (
<>
{contextHolder}

<Row gutter={24} style={{margin:'2rem 0',display:'flex',flexDirection:'column'}}>
  <Col>
  <h5 style={{fontWeight:650}}>
    Create Defects <EditOutlined /></h5>
    

    </Col>
  <Col style={{margin:'1rem'}}>

  <Form
      layout='inline'
      form={form}
      size= 'large'
      variant="filled"
      
    >

      <Form.Item label={<h6>Defects Name</h6>} >
        <Input placeholder="Enter Defect Name"  onChange={(e)=>setData(e.target.value)} />
      </Form.Item>
      <Form.Item  label={<h6>Select Color</h6>}>
        <ColorPicker defaultValue="#1677ff"  onChange={setColor} />
      </Form.Item>
      <Form.Item >
      <Input placeholder="input placeholder" value={handleChange} />
      </Form.Item>
      <Form.Item >
        <Button style={{background:'#EC522D',color:'#fff'}} onClick={()=>handlePost('defect')}>Create Defects</Button>
      </Form.Item>
    </Form>
  
  
  </Col>
</Row>

<Table  columns={columns} dataSource={tableData}  pagination={{ pageSize: 6 }}  />


</>
  )
}

export default Defects