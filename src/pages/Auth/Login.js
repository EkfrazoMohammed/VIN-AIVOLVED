// src/pages/Auth/Login.js
import React, {  useState ,useEffect } from 'react';
import {Row, Card, Col, Input, Checkbox, notification ,ConfigProvider } from 'antd';
import { useNavigate,Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../API/axiosInstance'; // Ensure this is correctly imported
import { signInFailure, signInSuccess } from '../../redux/slices/authSlice'; // Import the setAuthData action
import { userSignInSuccess } from '../../redux/slices/userSlice'; // Import the setAuthData action
import { encryptAES, decryptAES } from '../../redux/middleware/encryptPayloadUtils';
import  "../../assets/styles/login.css"
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginPayload, setLoginPayload] = useState({
    email_or_phone: "",
    password: "",
  });

  const [error, setError] = useState({
    UserError: "",
    PasswordError: "",
  });

  const openNotification = (status, message) => {
    notification[status]({
      message: <div style={{ fontSize: "1.1rem", fontWeight: "600" }}>{message}</div>,
      duration: 2,
    });
  };
const [saveUserLocal,setSaveUserLocal] = useState(false);

  const loginPost = async () => {
    setError({ UserError: "", PasswordError: "" });
    setLoading(true);

    // Validate email or mobile number
    const validateInput = (input) => {
      const emailPattern = /^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
      const mobilePattern = /^\+?\d{8,15}$/;
      return emailPattern.test(input) || mobilePattern.test(input);
    };

    let hasError = false;

    // Validate inputs
    if (!loginPayload.email_or_phone) {
      setError(prev => ({ ...prev, UserError: "*Email / Mobile Number is required" }));
      hasError = true;
    } else if (!validateInput(loginPayload.email_or_phone)) {
      setError(prev => ({ ...prev, UserError: "*Please enter a valid Email or Mobile Number" }));
      hasError = true;
    }

    if (!loginPayload.password) {
      setError(prev => ({ ...prev, PasswordError: "*Password is required" }));
      hasError = true;
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    // Proceed with login if no errors

    try {
      const encryTedData =  await encryptAES(JSON.stringify(loginPayload))
      

      const res = await axiosInstance.post('/login/', { data: encryTedData });

      const decrypt =  await decryptAES(res.data.response)

      const { access_token, refresh_token, user_id, is_superuser, first_name, last_name, user_name, message } = JSON.parse(decrypt);
      dispatch(signInSuccess({ accessToken: access_token, refreshToken: refresh_token }));
   if(saveUserLocal){
     localStorage.setItem("rememberMeClicked",saveUserLocal); // Set local Remember Me state
   }
   
      dispatch(userSignInSuccess({ userId: user_id, userName: user_name, firstName: first_name, lastName: last_name, isSuperUser: is_superuser }))
      openNotification("success", message);
      // if (is_superuser) {
      //   navigate("/location");
      // } else {
      //   navigate("/plant");
      // }
    
      navigate("/plant");


    } catch (error) {
      dispatch(signInFailure(error.response?.data));
      openNotification("error", error.response?.data?.message
        || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };




  const handleChange = (e) => {

    const { name, value,  checked } = e.target;


    setLoginPayload(prev => ({ ...prev, [name]: value }));
    // Clear error messages on input change
    if (name === "email_or_phone") {
      setError(prev => ({ ...prev, UserError: "" }));
    }
    if (name === "password") {
      setError(prev => ({ ...prev, PasswordError: "" }));
    }
  // Handle Remember Me checkbox
 
    // Handle Remember Me checkbox
    if (name === "rememberMe") {
      if (checked) {
        localStorage.setItem("rememberMeClicked", true); // Set Remember Me immediately
        setSaveUserLocal(true);
      } else {
        localStorage.setItem("rememberMeClicked", false);
        setSaveUserLocal(false);
      }

  }
  };


const handleKeydown =  (event)=>{
  if(event.key === "Enter"){
    console.log("enter key Pressed")
    console.log(loginPayload)
    loginPost()
  }
}



  return (
<div className='login_bg'>
      <Row gutter={24} className=' h-full flex justify-center items-center'   >
      <Col  span={16} className='login_logo_bg flex justify-center items-center' >
      <div className=' w-2/3 h-[40%] text-5xl font-extrabold text-white font-michroma flex flex-col gap-4  '>
    <img alt='loadingLogoErr'  src='https://eimkeia.stripocdn.email/content/guids/CABINET_8270216c780e362a1fbcd636b59c67ae376eb446dc5f95e17700b638b8c3f618/images/indus_logo_dev.png' className='w-80 h-auto' />
    <div >See the  unseen,<br/>Secure the future</div>
      </div>
      </Col>
      <Col span={8} className='bg-[#091128] h-full flex justify-center items-center' >
        <Card bordered={false} className='bg-transparent' style={{ padding: '1rem', borderRadius: '25px' }}>
          {/* <div className='flex items-center m-auto py-2'>
            <img src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png" alt="Logo" style={{ height: '70px' }} />
          </div> */}
          <div className='text-white' style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className='flex justify-start items-center font-semibold text-2xl'>Login</h3>
            <div>
              <label className='font-semibold text-[0.8rem] pb-1' >
                Email ID / Mobile number<span style={{ color: 'red', fontWeight: '900', fontSize: '0.8rem', marginLeft: '0.1rem' }}>*</span>
              <ConfigProvider
                 theme={{
    token: {
      colorTextPlaceholder:"#797e8c",
        colorText:"#fff",
        colorBgContainerDisabled	:"#3e4557"
    },
  }}
>
  
              <Input
           
                placeholder="Enter Email id /Mobile number"
                className='h-[50px] pl-2 py-0 !bg-[#3e4557] border-0 !text-white font-semibold input-custom'
                name="email_or_phone"
                onChange={handleChange}
                status={error.UserError ? "error" : ""}
                onKeyDown={handleKeydown}
              />
</ConfigProvider>
              </label>
              <div>

              {error.UserError && <span style={{ color: 'red', fontWeight: '700', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{error.UserError}</span>}
              </div>
            </div>
            <div >
              <label className='font-semibold text-[0.8rem] pb-1 w-full'>
                Password<span style={{ color: 'red', fontWeight: '900', fontSize: '1rem', marginLeft: '0.1rem' }}>*</span>
              <ConfigProvider
  theme={{
    token: {
      colorTextPlaceholder:"#797e8c",
      colorIcon:"#fff",
      colorText:"#fff",
     
    },
  }}
>
              <Input.Password
                placeholder="Enter password"
                className='h-[50px] w-full py-0 !bg-[#3e4557] border-0 !text-white font-semibold'
                name='password'
                onChange={handleChange}
                status={error.PasswordError ? "error" : ""}
                onKeyDown={handleKeydown}
              />

</ConfigProvider>
              </label>
              <div>
                
              {error.PasswordError && <span style={{ color: 'red', fontWeight: '700', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{error.PasswordError}</span>}
              </div>
<Link to="/reset-password-email" className="flex items-center justify-end text-center font-semibold text-[0.8rem] py-1">
              <span className='text-red-600 pr-1'>Forgot password ?</span>  Click here to reset
            </Link>
           
            </div>
            <div className="flex gap-4 " >
            <ConfigProvider
    theme={{
      components: {
   
        Checkbox: {
          colorPrimary: '#153da7',
        },
      },
    }}
  >

              <Checkbox className='font-bold text-white'    onChange={handleChange} name="rememberMe">Remember Me</Checkbox>
  </ConfigProvider>
            </div>
            <div>
              <button
              
                style={{ padding: '0.8rem 3rem', border: 'none', borderRadius: '5px', color: '#fff', fontWeight: '600' }}
                onClick={loginPost}
                className='login_button'
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

       
          </div>
        </Card>
      </Col>
      </Row>
    </div>
  );
};

export default Login;
