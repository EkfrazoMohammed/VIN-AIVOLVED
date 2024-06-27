import React ,{useEffect, useMemo, useState} from 'react';
import {Button,Modal, Select ,Space, Card, Col, Row ,ColorPicker,Table, Tag, Form, Input, Radio, notification, Descriptions } from 'antd';
import { Switch } from 'antd';
import axios from "axios";

import {  EditOutlined,ReloadOutlined} from '@ant-design/icons';
import { AuthToken, baseURL, localPlantData } from '../../API/API';
import { render } from '@testing-library/react';


const Defects = () => {
  const localItems = localStorage.getItem("PlantData")
  const localPlantData = JSON.parse(localItems) 
  const [modal2Open, setModal2Open] = useState(false);
  const[editData,setEditData] =  useState("")
  const [searchResult,setsearchResult] = useState()

// Table Columns
const handleEdit = (value)=>{
  setEditData(value);
setModal2Open(true)
}
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
      
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ['ascend','descend' ,'cancel'],

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
    // {
    //   title: 'Edit ',
    //   render: (text)=><div className="" style={{cursor:'pointer'}} onClick={()=>handleEdit(text)}><EditOutlined /></div>,
    //   id: 'color_code',
    // },

  ];
// Table  Data 


const locale = {
  Table: {
    sortTitle: 'Sort',
      triggerAsc: 'Click to sort in ascending order by defect name',
      triggerDesc: 'Click to sort in descending order by defect name',
    cancelSort: 'Click to cancel sorting',
  },
};
const [api, contextHolder] = notification.useNotification();
const [tableData,setTableData] = useState([])
const [optionsData,setOptionsData] = useState([]);
const [selectedValue,setSelectedValue] = useState([]);

const handleDefectChange = async(value) =>{
  setSelectedValue(value)
 const data =   await tableData.filter((item)=> value === item.id)
  await setTableData(data)
  }


  const fetchData = async () =>{
    const url = await `${baseURL}defect/?plant_name=${localPlantData.plant_name}`
    await axios.get(url,{
      headers:{
        'Authorization': `Bearer ${AuthToken}`
      }
    })
    .then((res) =>{
        setTableData(res.data.results);
        setOptionsData(res.data.results)}
    )
    .catch(err=> console.log(err))
  }

useEffect(()=>{
  fetchData()
},[]);

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

const handleRefresh = ()=>{
  setSelectedValue(null)
  fetchData()
}

// const limitedDataSource = tableData.slice(0, 5);

  return (
<>
{contextHolder}

{/* <Row gutter={24} style={{margin:'2rem 0',display:'flex',flexDirection:'column'}}>
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
</Row> */}
<div className="" style={{display:"flex",gap:"1rem",margin:'1rem 0'}}>
  <Select
    showSearch
    value={selectedValue}
    style={{ width: 200,height:"40px" }}
    placeholder="Search to Select Defects"
    optionFilterProp="label"
    onChange={(val)=>{handleDefectChange(val)}}

filterOption={(input,tableData)=>
  (tableData?.children ?? "").toLowerCase().includes(input.toLowerCase())
  
}
  >
      {tableData.map(defect => (
    <Select.Option  key={defect.id} value={defect.id}>{defect.name}</Select.Option>
  ))}
  </Select>

  <Button onClick={handleRefresh} style={{display:"flex",alignItems:'center',justifyContent:"center"}}><ReloadOutlined style={{width:"50px"}} /></Button>
</div>
<Table  columns={columns} dataSource={tableData}  pagination={{ pageSize: 6 }} locale={locale.Table}  />

<Modal
        title={<div style={{textAlign:"center",fontSize:'1.3rem'}}>Update Defect</div>}
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        <div className="" style={{display:'flex',flexDirection:'column',gap:'2rem',padding:'1rem'}}>
        <Form
      layout='inline'
      form={form}
      size= 'large'
      variant="filled"
      style={{display:'flex',flexWrap:'nowrap',gap:'1rem',justifyContent:'center',flexDirection:'column'}}
      
    >

      <Form.Item label={<h6>Defects Name</h6>} >
        <Input placeholder="Enter Defect Name"  onChange={(e)=>setData(e.target.value)} />
      </Form.Item>
      <Form.Item  label={<h6>Select Color</h6>}>
      <span>        <ColorPicker defaultValue="#1677ff"  onChange={setColor} />
        <Input placeholder="input placeholder" value={handleChange} />
      </span>
      

      </Form.Item>
    
    </Form>
        </div>
        <div className="" style={{display:'flex',justifyContent:'flex-end',padding:'1rem'}}>
        <Button type="primary" style={{width:'20%',padding:'0'}} danger onClick={()=>handlePost()}>
Submit
    </Button>

        </div>
             </Modal>
</>
  )
}

export default Defects