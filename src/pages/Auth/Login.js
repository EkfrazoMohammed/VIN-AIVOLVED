// src/pages/Auth/Login.js
import React, { useState } from 'react';
import { Card, Col, Input, Checkbox, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../API/axiosInstance'; // Ensure this is correctly imported
import { setAuthData } from '../../redux/slices/authSlice'; // Import the setAuthData action

const Login = () => {
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
    // Reset errors
    setError({ UserError: "", PasswordError: "" });

    // Validate inputs
    if (!loginPayload.email_or_phone) {
      setError(prev => ({ ...prev, UserError: "*Email / Mobile Number is required" }));
    }
    if (!loginPayload.password) {
      setError(prev => ({ ...prev, PasswordError: "*Password is required" }));
    }

    // Proceed with login if no errors
    if (loginPayload.email_or_phone && loginPayload.password && !error.UserError && !error.PasswordError) {
      try {
        const res = await axiosInstance.post('/login/', loginPayload);
        if (res.status === 200) {
          const { access_token, refresh_token, user_id,first_name,last_name,user_name,is_superuser } = res.data;
        let myuser={
          user_id,first_name,last_name,user_name,is_superuser
        }
          dispatch(setAuthData({ access_token, refresh_token, myuser }));
          openNotification("success", "Login Successful");
          navigate("/Plant");
        }
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
                style={{ height: "1.5rem", width: "100%", padding: "1.5rem", borderRadius: "5px", outline: "none" }}
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
                style={{ width: "100%", borderRadius: "5px", padding: "0.4rem 1.5rem", outline: "none" }}
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
              >
                Login
              </button>
            </div>
          </div>
        </Card>
      </Col>
    </div>
  );
};

export default Login;
