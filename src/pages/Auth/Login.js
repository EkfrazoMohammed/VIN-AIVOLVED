// src/pages/Auth/Login.js
import React, { useEffect, useState } from 'react';
import { Card, Col, Input, Checkbox, notification, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../API/axiosInstance'; // Ensure this is correctly imported
import { signInFailure, signInSuccess } from '../../redux/slices/authSlice'; // Import the setAuthData action
import { userSignInSuccess } from '../../redux/slices/userSlice'; // Import the setAuthData action
// import { decrypTion, encrypTion } from '../../redux/middleware/queryParamUtils';
import { encryptAES, decryptAES } from '../../redux/middleware/encryptPayloadUtils';
import { Link } from 'react-router-dom'

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
    setLoading(true);

    // Validate email or mobile number
    const validateInput = (input) => {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const mobilePattern = /^\+?[0-9]{8,15}$/;
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
      const encryTedData = encryptAES(JSON.stringify(loginPayload))

      const res = await axiosInstance.post('/login/', { data: encryTedData });

      const decrypt = await decryptAES(res.data.response)

      const { access_token, refresh_token, user_id, is_superuser, first_name, last_name, user_name, message } = JSON.parse(decrypt);
      dispatch(signInSuccess({ accessToken: access_token, refreshToken: refresh_token }));
      dispatch(userSignInSuccess({ userId: user_id, userName: user_name, firstName: first_name, lastName: last_name, isSuperUser: is_superuser }))
      openNotification("success", message);
      navigate("/plant");

    } catch (error) {
      // Dispatch failure action
      dispatch(signInFailure(error.response?.data));
      //console.log(error)
      // Notify error
      openNotification("error", error.response?.data?.message
        || "Invalid Credentials");
    } finally {
      setLoading(false);
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
        <Card bordered={false} style={{ padding: '1rem', borderRadius: '25px' }}>
          <div className='flex items-center m-auto py-2'>
            <img src="https://aivolved.in/wp-content/uploads/2022/11/ai-logo.png" alt="Logo" style={{ height: '70px' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 className='flex justify-center items-center font-semibold text-lg'>Login</h3>
            <div>
              <label style={{ fontWeight: "600", fontSize: '1rem' }}>
                Email ID / Mobile number
                <span style={{ color: 'red', fontWeight: '900', fontSize: '1rem', marginLeft: '0.1rem' }}>*</span>
              </label>
              <Input
                placeholder="Enter Email id /Mobile number"
                className='h-[45px] pl-2 py-0'
                name="email_or_phone"
                onChange={handleChange}
                status={error.UserError ? "error" : ""}
              />
              {error.UserError && <span style={{ color: 'red', fontWeight: '700', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{error.UserError}</span>}
            </div>
            <div>
              <label style={{ fontWeight: "600", fontSize: '1rem' }}>
                Password
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
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <Link to="/reset-password-email" className="flex items-center justify-center text-center font-semibold text-[1rem]">
              Forgot password ?
            </Link>
          </div>
        </Card>
      </Col>
    </div>
  );
};

export default Login;
