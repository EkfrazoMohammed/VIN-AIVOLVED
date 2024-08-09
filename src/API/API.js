// src/axiosInstance.js
import axios from 'axios';
import { useSelector } from 'react-redux';

export const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://huldev.aivolved.in/api/';
export const AuthToken = process.env.REACT_APP_API_BASE_URL || 'https://huldev.aivolved.in/api/';

export const useAPI = () => {
  const baseURL = useSelector((state) => state.api.baseURL || baseURL);
  const token = useSelector((state) => state.user.token); // Assuming userSlice manages token

  const API = axios.create({
    baseURL,
  });

  API.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  return API;
};
