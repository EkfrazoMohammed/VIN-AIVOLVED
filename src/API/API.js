import axios from "axios";
import { useState } from "react";
// const   baseURL =  'http://159.65.157.118:8006/api/';
const   baseURL =  'https://hul.aivolved.in/api/';
// const baseURL =  'http://vin.aivolved.in:8100/';
// const baseURL =  'http://159.65.157.118:8005/';
// const baseURL =  'http://localhost:8001/api';


const token = localStorage.getItem("token");
const getLocalRefresh = localStorage.getItem("refreshToken");
const refreshTokens  = JSON.parse(getLocalRefresh)
const AuthToken = JSON.parse(token)
const localItems = localStorage.getItem("PlantData")
const localPlantData = JSON.parse(localItems) 


const API = axios.create({
    baseURL,
})





// const [refreshTokens, setrefreshTokens] = useState(() => 
//     JSON.parse(localStorage.getItem('refreshToken')) || null
//   );
  const refreshToken = async () => {
    try {
      const response = await axios.post(`${baseURL}refresh_token/`, {
        refresh: refreshTokens,
      });
      console.log(response)
 
      localStorage.setItem("token",JSON.stringify(response.data.access))

    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

const axiosInstance =  axios.create({
    baseURL
});

axiosInstance.interceptors.response.use((response)=>response,
async (error)=>{
    if(error.response && error.response.status === 401){
        try {
            
    const newToken =  await refreshToken();
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    const originalRequest = error.config;
    originalRequest.headers['Authorization'] =  `Bearer ${newToken}`;

    return axios(originalRequest);
    

        } catch (refreshError) {
            return Promise.reject(refreshError)
        }
    }
  return Promise.reject(error)
}

)

export {baseURL,API,AuthToken,localPlantData,axiosInstance}
