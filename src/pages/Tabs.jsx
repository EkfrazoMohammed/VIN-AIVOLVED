import React, { useEffect, useState,useMemo } from 'react';
import {Button, Select ,Space, Card,Table,Tag, Col, Row ,ColorPicker, Form, Input, Radio, notification, Descriptions } from 'antd';

import axios from "axios";
import { API,baseURL } from '../API/API';
import { render } from '@testing-library/react';

import {  EditOutlined} from '@ant-design/icons';


const TabsData = ({param}) => {
  const [urlparam,setUrlparam]=useState(param)

  const columns = [
    {
      title: "Defect",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Color",
      dataIndex: "Color",
      key: "Color",
      render:(col)=><div className="" style={{width:'40px',height:'40px',background:`${col}`,borderRadius:'25px'}}></div>
    },
    {
      title: "Color Code",
      dataIndex: "Color",
      key: "Color",
    },

  ];
  const datas = [
    {
      key: '1',
      name: 'John Brown',
      Color:' #000',
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      Color: '#0D66E2',
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      Color: '#EC5E00',
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const [api, contextHolder] = notification.useNotification();

const [tableData,setTableData]=useState([])
const [color, setColor] = useState("#561ecb");
const [data,setData] = useState();
const [form] = Form.useForm();

const handleChange = useMemo(
  ()=>(typeof color === "string" ? color:color?.toHexString()),
  [color],
);
const handlePost = ()=>{
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
    "color_code": handleChange
  }
  console.log(urlparam)
  const PostData = async()=>{
    const res = await axios.post(`${baseURL}${urlparam}/`,payload)
    try{
      api.open({
        message: `${param} created`,
        placement:'top',
             });
    }
    catch(err){
      console.log(err)
    }

  }
  PostData()
}

    useEffect(()=>{
        const url = `${baseURL}/${param}`
        axios.get(url)
        .then(res=>
            setTableData(res.data)
        )
        .catch(err=>
            console.log(err)
        )
    },[])


  return (
    <div>

<Row gutter={24} style={{marginTop:'2rem',display:'flex',flexDirection:'column'}}>
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
        <Button style={{background:'#EC522D',color:'#fff'}} onClick={()=>handlePost()}>Create Defects</Button>
      </Form.Item>
    </Form>
  
  
  </Col>
</Row>
<Table columns={columns} dataSource={datas} />
    </div>
  )
}

export default TabsData