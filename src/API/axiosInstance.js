import axios from "axios";
const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE_URL || "https://huldev.aivolved.in/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    //console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
