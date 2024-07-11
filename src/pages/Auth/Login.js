import React, { useState } from 'react'
import { Card, Col, Row ,Input,Checkbox} from 'antd';
import axios from "axios";
import { baseURL } from '../../API/API';
import { Button, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const navigate = useNavigate()
const [api, contextHolder] = notification.useNotification();

const [loginPayload ,setloginPayload] = useState( {
  email_or_phone: "",
password: ""
})

const [error,setError]=useState({
UserError : "",
PasswordError:""
})
const [userData,setuserdata] =  useState();


const openNotification = (param) => {
    const {status,message} = param
    
    api[status]({
      message: <div style={{fontSize:"1.1rem",fontWeight:"600"}}>{message || ""}</div>,
    //   description:
    //     'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
      duration: 0,
    });
  };


const loginPost = async()=>{
    try {

     if(loginPayload.email_or_phone === ""){
     setError((prev)=>({...prev,UserError:"*Email / Mobile Number not entered"}))
     }

     if(loginPayload.password === ""){
        setError((prev)=>({...prev,PasswordError:"*Password is required"}))
     }

if(loginPayload.email_or_phone !== "" && loginPayload.password !== "" && error.UserError === "" && error.PasswordError === ""  ){

    const res = await axios.post(`${baseURL}login/`,loginPayload);

    if(res.status == 200){
      console.log(res.data)
        setuserdata(res.data)
        localStorage.setItem("token",JSON.stringify(res.data.access_token))
        localStorage.setItem("refreshToken",JSON.stringify(res.data.refresh_token))
        openNotification({status:"success",message:"Login Successful"});
        setTimeout(()=>{
          navigate("/Plant" );
         window.location.reload()

        },1500)
      }


}
   
    } catch (error) {
     
            openNotification({status:"error",message:"Invalid Credentials"})
        
       
    }
}

const handleChange = (e) =>{
const {name, value} = e.target;

if(name === "email_or_phone" ){
    setError((prev)=>({...prev,UserError:""}))
}
if(name === "password" ){
    setError((prev)=>({...prev,PasswordError:""}))
}

setloginPayload((prev)=>({...prev,[name]:value}))
}
console.log(loginPayload)
  return (
    <>
       {contextHolder}
    <div className="" style={{background:'#faf5f5',height:'100vh',width:'100%',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
    <Col span={8} style={{maxWidth:'500px'}}>

      <Card  bordered={false} style={{padding:'2rem',borderRadius:'25px'}}>
    <div className="" >
    <img src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png" style={{height:'70px'}} alt="" />
    </div>
    <div className="" style={{display:'flex',flexDirection:'column',gap:'1rem',}}>
        <h3 >Login</h3>
        <div className="">
         
          <label htmlFor="" style={{fontWeight:"600",fontSize:'1rem'}}>  Enter Email / Mobile Number<span style={{color:'red',fontWeight:'900',fontSize:'1rem',marginLeft:'0.1rem'}}>*</span> </label>
          <Input placeholder="Email/Mobile Number"       style={{
              height: "1.5rem",
              width: "100%",
              padding: "1.5rem",  
              borderRadius: "5px",
              outline: "none",
              }} 
              name="email_or_phone"
              onChange={handleChange}
              status={error.UserError ? "error" : ""}
              />      


          {
            error.UserError ? <span style={{color:'red',fontWeight:'700',fontSize:'0.8rem',marginLeft:'0.5rem'}}>{error.UserError}</span>:""
          }
        </div>
        <div className="">
        <label htmlFor="" style={{fontWeight:"600",fontSize:'1rem'}}>Enter Password<span style={{color:'red',fontWeight:'900',fontSize:'1rem',marginLeft:'0.1rem'}}>*</span> </label>
   
     

          
           <Input.Password placeholder="Enter password"    
            style={{
            
              width: "100%",
              borderRadius: "5px",
              padding:"0.4rem 1.5rem",
              outline: "none",
              }}     
            name='password'
            onChange={handleChange}
            status={error.PasswordError ? "error" : ""}

            />
              {
            error.PasswordError ? <span style={{color:'red',fontWeight:'700',fontSize:'0.8rem',marginLeft:'0.5rem'}}>{error.PasswordError}</span>:""
          }
        </div>

        <div className="" style={{display:'flex',gap:'1rem'}}>
        <Checkbox  style={{fontWeight:'700'}}>Remember Me</Checkbox>
        </div>
            <div className="">
        <button style={{padding:'0.8rem 3rem',background:'#ff4403',border:'none',borderRadius:'5px',color:'#fff',fontWeight:'600'}} onClick={loginPost}>Login</button>
    </div>
    </div>
    {/* <div className="">
        <p style={{fontSize:'1rem', fontWeight:'bolder',cursor:"pointer"}} onClick={()=>navigate("/resetPassword")}>Reset Password?</p>
    </div> */}
  
      </Card>
 
    </Col>

    </div>




    </>
  )
}

export default Login