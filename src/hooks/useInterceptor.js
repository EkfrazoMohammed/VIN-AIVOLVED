import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiCall from "../API/Apicall";
import { signInSuccess } from "../redux/slices/authSlice";
import { encryptAES } from "../redux/middleware/encryptPayloadUtils";
import axios from "axios";

const useApiInterceptor = () => {


    let isRefreshing = false;
    let failedQueue = [];


    const processQueue = async (error, token = null) => {
        for (let request of failedQueue) {
            if (error) {
                request.reject(error);
            } else {
                request.resolve(token);
            }
        }
        failedQueue = [];
    };

    const dispatch = useDispatch();
    const refreshToken = useSelector((state) => state.auth.authData[0].refreshToken);
    const accessToken = useSelector((state) => state.auth.authData.access_token);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const interceptor = ApiCall.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response.status === 401 && !originalRequest._retry) {
                    if (isRefreshing) {

                        return new Promise((resolve, reject) => {
                            failedQueue.push({ resolve, reject });
                        })
                            .then((token) => {
                                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                                return ApiCall(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    setRefresh(true);
                    isRefreshing = true;
                    const encryptedData = encryptAES(JSON.stringify({ refresh_token: refreshToken }));

                    try {
                        const response = await axios.post('https://huldev.aivolved.in/api/refresh_token/', {
                            data: encryptedData,
                        });

                        const { access_token } = response.data;

                        dispatch(signInSuccess({ accessToken: access_token, refreshToken }));

                        ApiCall.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

                        processQueue(null, access_token);

                        return ApiCall(originalRequest);
                    } catch (refreshError) {
                        processQueue(refreshError, null);
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
            ApiCall.interceptors.response.eject(interceptor);
        };
    }, [refreshToken, accessToken, refresh, dispatch]);

    return ApiCall;
};

export default useApiInterceptor;