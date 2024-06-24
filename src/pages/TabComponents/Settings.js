import React ,{useMemo, useState} from 'react';
import {Button, Select ,Space, Card, Col, Row ,ColorPicker, Form, Input, Radio, notification, Descriptions } from 'antd';
import { Switch } from 'antd';
import axios from "axios";
import {  Modal } from 'antd';
import {  EditOutlined} from '@ant-design/icons';
import { baseURL } from '../../API/API';
import { ColorRing } from 'react-loader-spinner'


const Alerts = () => {
  const [api, contextHolder] = notification.useNotification();
  const [loading,setLoading] = useState(false)
  const [modal2Open, setModal2Open] = useState(false);
  const initialState = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: ""
  };
  const [data,setData] = useState({
    first_name:"" ,
    last_name: "",
    phone_number: "",
    email:""
  });


  const [error,setError] = useState({
    fistName:"",
    lastName:"",
    Phone:"",
    email:""
  })
  const openNotification = (param) => {
    const {status,message} = param
    
    api[status]({
      message:<div style={{whiteSpace:"pre-line"}}>{message }</div>|| "",
    //   description:
    //     'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
      duration: 5,
    });
  };
const handlePost = async()=>{
  try {

if(data.first_name === ""){
  setError((prev)=>({...prev,fistName:"Please Enter First Name value"}))
}
if(data.last_name === ""){
  setError((prev)=>({...prev,lastName:"Please Enter Last Name value"}))
}

if(data.phone_number === ""){
  setError((prev)=>({...prev,Phone:"Please Enter Phone Number value"}))
}
if(data.email === ""){
  setError((prev)=>({...prev,email:"Please Enter Email value"}))
}
    const payload = {
      "first_name": data.first_name,
      "last_name": data.last_name,
      "phone_number": data.phone_number,
      "email": data.email
    }

    if(data.first_name !== "" && data.last_name !== "" && data.phone_number !== "" && data.email !== "" && error.fistName === "" && error.lastName === "" && error.email === "" && error.Phone ==="" ){
      setLoading(true)
      const postRequest =  await axios.post(`${baseURL}user/`,payload)
      if(postRequest){
        openNotification({status:"success",message:"User Created Successfully"});
        setLoading(false)
        setModal2Open(false)
        setData(initialState)
      }

    }else{
      setLoading(false)
      console.log("ERROR")
    }
  } catch (error) {
    setLoading(false)
    openNotification({status:"error",message:`${error.response.data.email ? error.response.data.email : ""} \n ${error.response.data.phone_number ? error.response.data.phone_number : ""}`});
  }
}


const handleChange = (e)=>{
const {name, value} =  e.target
const emailRegex = /^[^\s@]+@[^\s@]+\[^\s@]+$/;
if(name === "first_name"){
  setError((prev)=>({...prev,fistName:""}))
}
if(name === "last_name"){
  setError((prev)=>({...prev,lastName:""}))

}
if(name === "phone_number"){
  setError((prev)=>({...prev,Phone:""}))

}
if(name === "email" ){
  if(emailRegex.test(data.email)){
    setError((prev)=>({...prev,email:"Enter Valid Email"}))
  }
  else {
    setError((prev)=>({...prev,email:""}))
  }
}

setData((prev)=>({...prev,[name]:value}))

} 

  return (
<>
{contextHolder}
<Row gutter={24} style={{display:'flex',justifyContent:'space-between'}}>
<Col span={9} > 
<h5 style={{fontWeight:650}}>User Creation</h5>
</Col>
<Col span={3}  >

<Button type="primary" style={{width:'100%',padding:'0'}} danger onClick={()=>setModal2Open(true)}>
User Creation
    </Button>   </Col>
</Row>
<Row gutter={24} style={{display:'flex',flexDirection:'column',gap:'2rem',margin:'2rem'}} >
  <Col span={16} style={{display:'flex',justifyContent:'space-between'}}>
<div className="">
  <h6>Email Id</h6>
  <h6>developer@mail.com</h6>
</div>
<div className="">
<h6>Mobile Number</h6>
  <h6>987654310</h6>
</div>
<div className="">
<h6>Password</h6>
  <h6>12345</h6>
</div>
  </Col>
  <Col span={9}><h6 style={{fontWeight:650}}>Users</h6></Col>
  <Col span={16} style={{display:'flex',justifyContent:'space-between'}}>
  <div className="">
  <h6>Email Id</h6>
  <h6>developer@mail.com</h6>
</div>
<div className="">
<h6>Mobile Number</h6>
  <h6>987654310</h6>
</div>
<div className="">
<h6>Password</h6>
  <h6>12345</h6>
</div>
  </Col>
</Row>
<Row style={{display:'flex',gap:'2rem',flexDirection:'column',marginTop:'1rem'}}>
  <Col style={{display:'flex',alignItems:'center' ,gap:'1rem'}}>
  <h5 style={{fontWeight:650,marginBottom:0}}>Send email notification</h5>
  <Switch defaultChecked />
  </Col>
  <Col style={{display:'flex',alignItems:'center' ,gap:'1rem'}}>
  <h5 style={{fontWeight:650,marginBottom:0}}>Send sms notification</h5>
  <Switch defaultChecked />

  </Col>
</Row>
<Modal
        title={<div style={{textAlign:"center",fontSize:'1.3rem'}}>Create User</div>}
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
        footer={null}
      >
        {
          loading ?
          <div className="" style={{display:'flex',justifyContent:'center',width:'100%',minHeight:'250px',alignItems:'center'}}>
      <ColorRing
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperClass="color-ring-wrapper"
          colors={['#008ffb', '#008ffb', '#008ffb', '#008ffb', '#008ffb']}
          />
          </div>
         :
<>
        <div className="" style={{display:'flex',flexDirection:'column',gap:'1rem',padding:'1rem'}}>

       <Input placeholder="Enter Your First Name" type='text' name='first_name'value={data.first_name} onChange={handleChange} />
       {error.fistName ? <span style={{fontWeight:'600',color:'red'}}>{error.fistName}</span> : ""}

       <Input placeholder="Enter Your Last Name"  type='text' name='last_name' value={data.last_name} onChange={handleChange} />
       {error.lastName ?  <span style={{fontWeight:'600',color:'red'}}>{error.lastName}</span> : ""}


       <Input placeholder="Enter Your Phone Number" type='number' name='phone_number' value={data.phone_number} onChange={handleChange} />
       {error.Phone ?  <span style={{fontWeight:'600',color:'red'}}>{error.Phone}</span> : ""}


       <Input placeholder="Enter Your Email"  type='email' name='email' value={data.email} onChange={handleChange}  />
       {error.email ? <span style={{fontWeight:'600',color:'red'}}>{error.email}</span> : ""}

        </div>
        <div className="" style={{display:'flex',justifyContent:'flex-end',padding:'1rem'}}>
        <Button type="primary" style={{width:'20%',padding:'0'}} danger onClick={()=>handlePost()}>
Submit
    </Button>

        </div>
</>
        }
             </Modal>
</>
  )
}

export default Alerts