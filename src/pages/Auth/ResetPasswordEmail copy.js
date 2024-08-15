import React, { useState } from 'react'
import { Card, Col, Row, message } from 'antd';
import axios from "axios";
import { baseURL } from '../../API/API';
import { Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined 
  } from '@ant-design/icons';

const ResetPassword = () => {
  const navigate = useNavigate()
const [api, contextHolder] = notification.useNotification();

const [resetPayload ,setresetPayload] = useState( {
  email: "",
  new_password: "",
  confirm_password:""
})

const [error,setError]=useState({
emailError : "",
newPassError:"",
confPassError:""
})
const [userData,setuserdata] =  useState();
const [toggleEmail,setToggleEmail] = useState(true);

const openNotification = (param) => {
    const {status,message} = param
    
    api[status]({
      message:message || "",
    //   description:
    //     'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
      duration: 0,
    });
  };


const resetPost = async()=>{
    try {

     if(resetPayload.new_password === ""){
        setError((prev)=>({...prev,newPassError:"Password is empty"}))
     }
     if(resetPayload.confirm_password === ""){
        setError((prev)=>({...prev,confPassError:"Confirm Password is empty"}))
     }

if(resetPayload.new_password !== "" || resetPayload.confirm_password !== "" || resetPayload.email !== ""){
    const payload = {
          new_password:resetPayload.new_password  ,
          confirm_password: resetPayload.confirm_password
    }
    const res = await axios.post(`${baseURL}reset_password/?email=${resetPayload.email}`,payload);
    if(res.status == 200){
        openNotification({status:"success",message:"Reset Password Successful"});
     setTimeout(()=>{
        navigate("/login" )
    },2000)
      }


}
   
    } catch (error) {
        console.log()
        if(error.response.status == 400){
            openNotification({status:"error",message:error.response.data.email[0]})
        }
       
    }
}

const handleChange = (e) =>{
const {name, value} = e.target;

if(name === "email" ){
    setError((prev)=>({...prev,emailError:""}))
}
if(name === "new_password" ){
    setError((prev)=>({...prev,newPassError:""}))
}
if(name === "confirm_password" ){
    setError((prev)=>({...prev,newPassError:""}))
}

setresetPayload((prev)=>({...prev,[name]:value}))
}

const confirmEmail =async ()=>{
try {
    if(resetPayload.email === ""){
        setError((prev)=>({...prev,emailError:"Email not entered"}))
        }
        if(resetPayload.email !== "" ){
            const res = await axios.get(`${baseURL}user/`)
            const userData = await res.data.results.filter((item)=>item.email === resetPayload.email)
           if(userData.length > 0){
            setToggleEmail(false)
           }
           else{
            openNotification({status:"error",message:"Email is not Registered"})
           }
        }
    
} catch (error) {
    
}
}
  return (
    <>
       {contextHolder}
    <div className="" style={{background:'#faf5f5',height:'100vh',width:'100%',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <Col span={6}>
    {
        toggleEmail ? 
      <Card  bordered={false} style={{padding:'2rem',borderRadius:'25px'}}>
    <div className="">
    <img src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png" style={{height:'80px'}} alt="" />
    </div>
        <p className="">
        <ArrowLeftOutlined  style={{fontSize:'1.5rem',cursor:'pointer'}} onClick={()=>navigate("/login")}/>
        </p>
    <div className="" style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        <h2 style={{margin:'0.5rem 0'}}>Enter Email</h2>
        <p>Reset link will be sent to the respective email id</p>
        <input
            type="text"
            style={{
              height: "1.5rem",
              width: "100%",
              padding: "1.5rem",
              border: "0.5px solid grey",
              borderRadius: "5px",
              outline: "none",
              }}
            name="email"
            placeholder="Email id"
            onChange={handleChange}
            helperText={error.emailError}
          />
          {
            error.emailError ? <span style={{color:'red',fontWeight:'600',fontSize:'0.8rem'}}>*{error.emailError}</span>:""
          }
     
    </div>
    <h2 className="">
        <button style={{padding:'1rem',background:'#ff4403',border:'none',borderRadius:'5px',color:'#fff',fontWeight:'600',fontSize:'1rem'}} onClick={confirmEmail}>Send Email</button>
    </h2>
      </Card>
      : 
      <Card  bordered={false} style={{padding:'2rem',borderRadius:'25px'}}>

          <p className="">
          <ArrowLeftOutlined  style={{fontSize:'1.5rem',cursor:'pointer'}} onClick={()=>navigate("/login")}/>
          </p>
      <div className="" style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          <h2 style={{margin:'0.5rem 0'}}>New Password</h2>
          <p style={{margin:'0.5rem 0',fontWeight:'600'}}>Enter your New Password</p>
          <input
              type="text"
              style={{
                height: "1.5rem",
                width: "100%",
                padding: "1.5rem",
                border: "0.5px solid grey",
                borderRadius: "5px",
                outline: "none",
                }}
              name="new_password"
              placeholder="Enter New Password"
              onChange={handleChange}
            />
            {
              error.newPassError ? <span style={{color:'red',fontWeight:'600',fontSize:'0.8rem'}}>*{error.newPassError}</span>:""
            }
                 <input
              type="text"
              style={{
                height: "1.5rem",
                width: "100%",
                padding: "1.5rem",
                border: "0.5px solid grey",
                borderRadius: "5px",
                outline: "none",
                }}
              name="confirm_password"
              placeholder="Enter Confirm  New Password"
              onChange={handleChange}
            />
            {
              error.confPassError ? <span style={{color:'red',fontWeight:'600',fontSize:'0.8rem'}}>*{error.confPassError}</span>:""
            }
       
      </div>
      <h2 className="">
          <button style={{padding:'1rem',background:'#ff4403',border:'none',borderRadius:'5px',color:'#fff',fontWeight:'600',fontSize:'1rem'}}onClick={resetPost} >Submit</button>
      </h2>
        </Card>
    }
    </Col>

    </div>




    </>
  )
}

export default ResetPassword