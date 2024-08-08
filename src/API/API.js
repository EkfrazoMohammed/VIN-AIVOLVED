// // API/API.js
// import axios from 'axios';

// // Base URL from environment variable
// const baseURL = process.env.REACT_APP_API_BASE_URL || 'https://hul.aivolved.in/api/';

// // Create an Axios instance
// const API = axios.create({
//   baseURL,
// });

// // Set up request interceptor to attach token
// API.interceptors.request.use(config => {
//   // If you need to access the token from Redux store
//   const { token } = store.getState().api;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// export { API };
import axios from 'axios';
import { useSelector } from 'react-redux';

export const useAPI = () => {
  const baseURL = useSelector((state) => state.api.baseURL);
  const token = useSelector((state) => state.api.token);

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
