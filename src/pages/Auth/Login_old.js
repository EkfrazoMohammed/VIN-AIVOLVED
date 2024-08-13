// src/pages/Auth/Login.js
import React, { useState } from 'react';
import { Card, Col, Input, Checkbox, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../API/axiosInstance'; // Ensure this is correctly imported
import { setAuthData, signInFailure, signInSuccess } from '../../redux/slices/authSlice'; // Import the setAuthData action
// import ApiCall from "../../API/Apicall"

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


  const loginPost = async () => {
    setError({ UserError: "", PasswordError: "" });
  
    // Validate email or mobile number
    const validateInput = (input) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const mobilePattern = /^\+?[0-9]{8,15}$/;
      return emailPattern.test(input) || mobilePattern.test(input);
    };
  
    // Validate inputs
    if (!loginPayload.email_or_phone) {
      setError(prev => ({ ...prev, UserError: "*Email / Mobile Number is required" }));
    } else if (!validateInput(loginPayload.email_or_phone)) {
      setError(prev => ({ ...prev, UserError: "*Please enter a valid Email or Mobile Number" }));
    }
  
    if (!loginPayload.password) {
      setError(prev => ({ ...prev, PasswordError: "*Password is required" }));
    }

    setLoading(true);
  
    // Proceed with login if no errors
    if (loginPayload.email_or_phone && loginPayload.password && !error.UserError && !error.PasswordError) {
      try {
        // const res = await ApiCall.post('/login/', loginPayload);
        const res = await axiosInstance.post('/login/', loginPayload);
        const data = res.data;
        console.log("login res", res);

        if (res.status !== 200) {
          dispatch(signInFailure(data));
          openNotification("error", error.response?.data?.detail || "Invalid Credentials");
          return;
        }
        dispatch(signInSuccess({accessToken: data.access_token ,  refreshToken: data.refresh_token}));
         openNotification("success", "Login Successful");
          navigate("/Plant");
        // if (res.status === 200) {
        //   const { access_token, refresh_token, user_id, first_name, last_name, user_name, is_superuser } = res.data;
        //   let myuser = { user_id, first_name, last_name, user_name, is_superuser };
        //   // dispatch(setAuthData({ access_token, refresh_token, myuser }));
        //   openNotification("success", "Login Successful");
        //   navigate("/Plant");
        // }
      } catch (error) {
        openNotification("error", error.response?.data?.detail || "Invalid Credentials");
      }
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginPayload(prev => ({ ...prev, [name]: value }));
    // Clear error messages on input change
    if (name === "email_or_phone") {
      setError(prev => ({ ...prev, UserError: "" }));
    }
    if (name === "password") {
      setError(prev => ({ ...prev, PasswordError: "" }));
    }
  };


  return (
    <div style={{ background: '#faf5f5', height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Col span={8} style={{ maxWidth: '500px' }}>
        <Card bordered={false} style={{ padding: '2rem', borderRadius: '25px' }}>
          <div>
            <img src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png" alt="Logo" style={{ height: '70px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>Login</h3>
            <div>
              <label style={{ fontWeight: "600", fontSize: '1rem' }}>
                Enter Email / Mobile Number
                <span style={{ color: 'red', fontWeight: '900', fontSize: '1rem', marginLeft: '0.1rem' }}>*</span>
              </label>
              <Input
                placeholder="Email/Mobile Number"
                className='h-[45px] pl-2 py-0'
                name="email_or_phone"
                onChange={handleChange}
                status={error.UserError ? "error" : ""}
              />
              {error.UserError && <span style={{ color: 'red', fontWeight: '700', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{error.UserError}</span>}
            </div>
            <div>
              <label style={{ fontWeight: "600", fontSize: '1rem' }}>
                Enter Password
                <span style={{ color: 'red', fontWeight: '900', fontSize: '1rem', marginLeft: '0.1rem' }}>*</span>
              </label>
              <Input.Password
                placeholder="Enter password"
                className='h-[45px] pl-2 py-0'
                name='password'
                onChange={handleChange}
                status={error.PasswordError ? "error" : ""}
              />
              {error.PasswordError && <span style={{ color: 'red', fontWeight: '700', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{error.PasswordError}</span>}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Checkbox style={{ fontWeight: '700' }}>Remember Me</Checkbox>
            </div>
            <div>
              <button
                style={{ padding: '0.8rem 3rem', background: '#ff4403', border: 'none', borderRadius: '5px', color: '#fff', fontWeight: '600' }}
                onClick={loginPost}
                className='w-full'
              >
                {loading? "Logging in..." : "Login" }
              </button>
            </div>
          </div>
        </Card>
      </Col>
    </div>
  );
};

export default Login;
