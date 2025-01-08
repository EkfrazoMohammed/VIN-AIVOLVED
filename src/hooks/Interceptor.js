
import React, { useEffect, useState } from "react";
import API from "../API/API";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useApiInterceptor = () => {
    const navigate = useNavigate();


    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = async (error, token = null) => {
        for (let request of failedQueue) {
            if (error) {
                request.reject(new Error (error));
            } else {
                request.resolve(token);
            }
        }
        failedQueue = [];
    };


    const token = localStorage.getItem("token");
    const accessToken = JSON.parse(token) 
    const refresh_Token  = localStorage.getItem("refreshToken");
    const refreshToken = JSON.parse(refresh_Token) 
    // const refreshToken = useSelector((state) => state.auth.authData[0].refreshToken);
    // const accessToken = useSelector((state) => state.auth.authData.access_token);
    const [refresh, setRefresh] = useState(false);

  
    const handleRefreshTokenExpiry = async () => {
        navigate("/login");
        localStorage.clear();
        sessionStorage.clear();
      };

    useEffect(() => {
        const interceptor = API.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error?.response?.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {

                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                                return API(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    setRefresh(true);
                    isRefreshing = true;
                    // const encryptedData = encryptAES(JSON.stringify({ refresh_token: refreshToken }));

                    try {
                        const response = await axios.post('http://localhost:8000/api/refresh_token/', {
                            data: refreshToken,
                        });

                        const { access_token } = response.data;

                        // dispatch(signInSuccess({ accessToken: access_token, refreshToken }));
                        localStorage.setItem("token",JSON.stringify(access_token))

                        API.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

                        processQueue(null, access_token);

                        return API(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        handleRefreshTokenExpiry()
                        return Promise.reject(refreshError);
                    } finally {
                        setRefresh(false);
                        isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            API.interceptors.response.eject(interceptor);
        };
    }, [refreshToken, accessToken, refresh,]);

    return API;
};

export default useApiInterceptor;
