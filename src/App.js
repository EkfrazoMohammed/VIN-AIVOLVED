import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthData, clearAuthData } from './redux/slices/authSlice';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from './API/axiosInstance'; // Ensure this is correctly configured
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

const App = () => {
  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth.authData);
  console.log(authData)
  const { access_token, refresh_token } = authData;
  
   const refreshTokenHandler = async () => {
    const currentRefreshToken = refresh_token; // Ensure it's defined
    if (!currentRefreshToken) return;
  
    try {
      const response = await axiosInstance.post('/refresh_token/', {
        refresh: currentRefreshToken,
      });
  
      const { access_token, refresh_token } = response.data;
      dispatch(setAuthData({ access_token, refresh_token })); 
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch(clearAuthData()); // Clear state if refresh fails
    }
  };
  

  useEffect(() => {
    if (refresh_token) {
      // Refresh the token every 15 minutes
      const interval = setInterval(() => {
        refreshTokenHandler();
      }, 30 * 60 * 1000); // Refresh every 30 minutes

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [refresh_token, dispatch]);

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
    { path: '/plant', element: <Plant /> }, // Changed to lowercase for consistency
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
