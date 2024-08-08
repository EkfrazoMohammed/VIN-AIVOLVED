// src/App.js
import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setToken, setRefreshToken, clearAuth } from './redux/slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Layout from './pages/Layout';
import Login from './pages/Auth/Login';
import ResetPassword from './pages/Auth/ResetPassword';
import Plant from './pages/Plant';
import Reports from './pages/Reports';
import AiSmartView from './pages/AiSmartView';
import Dashboard from './pages/Dashboard';
import MachinesParameter from './pages/MachinesParameter';
import Camera from './pages/Camera';
import Settings from './pages/Settings';
import Insights from './pages/Insights';
import Organisation from './pages/Organization';
import Select_dashboard from './pages/SelectDashboard';

const App = () => {
  const dispatch = useDispatch();
  const { refreshToken, token } = useSelector((state) => state.auth);

  const refreshTokenHandler = async () => {
    if (!refreshToken) return;
    try {
      const response = await axios.post(`${baseURL}refresh_token/`, {
        refresh: refreshToken,
      });
      dispatch(setToken(response.data.access));
      dispatch(setRefreshToken(response.data.refresh));
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch(clearAuth());
    }
  };

  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        refreshTokenHandler();
      }, 15 * 60 * 1000); // Refresh every 15 minutes

      return () => clearInterval(interval);
    }
  }, [token, refreshToken, dispatch]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { path: '', element: <Dashboard /> },
        { path: 'dashboard-home', element: <Dashboard /> },
        { path: 'reports', element: <Reports /> },
        { path: 'ai-smart-view', element: <AiSmartView /> },
        { path: 'machine-parameter', element: <MachinesParameter /> },
        { path: 'system-status', element: <Camera /> },
        { path: 'settings', element: <Settings /> },
        { path: 'insights', element: <Insights /> },
      ],
    },
    { path: '/login', element: <Login /> },
    { path: '/resetPassword', element: <ResetPassword /> },
    { path: '/Plant', element: <Plant /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
