import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../API/API";

const useApiInterceptor = () => {
    const navigate = useNavigate();

    let isRefreshing = false;
    let failedQueue = [];

    const processQueue = (error, access = null) => {
        failedQueue.forEach((request) => {
            if (error) {
                request.reject(error);
            } else {
                request.resolve(access);
            }
        });
        failedQueue = [];
    };

    const handleRefreshTokenExpiry = () => {
        navigate("/login");
        localStorage.clear();
        sessionStorage.clear();
    };

    useEffect(() => {
        // Request interceptor to ensure headers use the latest token
        const requestInterceptor = API.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("token");
                if (token) {
                    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle token refresh
        const responseInterceptor = API.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error?.response?.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {
                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then((accessToken) => {
                                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                                return API(originalRequest);
                            })
                            .catch((err) => Promise.reject(err));
                    }

                    originalRequest._retry = true;
                    isRefreshing = true;

                    try {
                        const refreshToken = JSON.parse(localStorage.getItem("refreshToken"));
                        const response = await axios.post(
                            'http://localhost:8000/api/refresh_token/',
                            { refresh: refreshToken }
                        );

                        const { access } = response.data;

                        // Update localStorage with the new token
                        localStorage.setItem("token", JSON.stringify(access));

                        // Apply the new token globally for subsequent requests
                        API.defaults.headers.common['Authorization'] = `Bearer ${access}`;

                        // Retry the original request with the new token
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;

                        processQueue(null, access);
                        return API(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
                        handleRefreshTokenExpiry();
                        return Promise.reject(refreshError);
                    } finally {
                        isRefreshing = false;
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            API.interceptors.request.eject(requestInterceptor);
            API.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return API;
};

export default useApiInterceptor;
