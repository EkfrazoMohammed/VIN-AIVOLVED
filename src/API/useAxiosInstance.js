// import { useEffect } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// // Create and configure axiosInstance
// const createAxiosInstance = (accessToken) => {
//   const instance = axios.create({
//     baseURL: process.env.REACT_APP_API_BASE_URL || "https://demo.indusvision.ai/api/",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${accessToken}` // Set the accessToken in the headers
//     },
//   });

//   instance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       //console.error("API Error:", error);
//       return Promise.reject(error);
//     }
//   );

//   return instance;
// };

// // Custom hook
// const useAxiosInstance = () => {
//   const accessToken = useSelector((state) => state.auth.authData.access_token);

//   useEffect(() => {
//     // Log the accessToken for debugging
//     // //console.log("Access Token:", accessToken);
//   }, [accessToken]);

//   // Create and return axios instance
//   return createAxiosInstance(accessToken);
// };

// export default useAxiosInstance;
