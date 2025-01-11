import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiCall from "../API/Apicall";
import { signInSuccess, signOut } from "../redux/slices/authSlice";
import {  encryptAES } from "../redux/middleware/encryptPayloadUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { dashboardSignout } from "../redux/slices/dashboardSlice";
import { defectSignout } from "../redux/slices/defectSlice";
import { departmentSignout } from "../redux/slices/departmentSlice";
import { dpmuSignout } from "../redux/slices/dpmuSlice";
import { machineSignout } from "../redux/slices/machineSlice";
import { plantSignOut } from "../redux/slices/plantSlice";
import { productSignout } from "../redux/slices/productSlice";
import { productVsDefectSignout } from "../redux/slices/productvsDefectSlice";
import { reportSignout } from "../redux/slices/reportSlice";
import { userSignOut } from "../redux/slices/userSlice";
import { defectTriggerSignOut } from "../redux/slices/defecTriggerSlice";

const useApiInterceptor = () => {
    const navigate = useNavigate();
    const clearReduxData = () => {
        dispatch(signOut());
        dispatch(dashboardSignout());
        dispatch(defectSignout());
        dispatch(departmentSignout());
        dispatch(dpmuSignout());
        dispatch(machineSignout());
        dispatch(plantSignOut());
        dispatch(productSignout());
        dispatch(productVsDefectSignout());
        dispatch(reportSignout());
        dispatch(userSignOut());
        dispatch(defectTriggerSignOut())
        // dispatch(ShiftSignout())
      }
      const clearSessionandLocalStorage = () => {
        sessionStorage.removeItem("persist:auth");
        sessionStorage.removeItem("persist:user");
        sessionStorage.removeItem("persist:plant");
        sessionStorage.removeItem("persist:report");
        sessionStorage.removeItem("persist:dashboard");
        sessionStorage.removeItem("persist:machine");
        sessionStorage.removeItem("persist:product");
        sessionStorage.removeItem("persist:department");
        sessionStorage.removeItem("persist:dpmu");
        sessionStorage.removeItem("persist:productVsDefect");
        sessionStorage.removeItem("persist:defect");
        sessionStorage.removeItem("persist:shift");
      }

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
    const dispatch = useDispatch();
    const refreshToken = useSelector((state) => state.auth.authData[0].refreshToken);
    const accessToken = useSelector((state) => state.auth.authData.access_token);
    const [refresh, setRefresh] = useState(false);

  
    const handleRefreshTokenExpiry = async () => {
        navigate("/login");
        localStorage.clear();
        clearSessionandLocalStorage();
        sessionStorage.clear();
        clearReduxData();
      };

    useEffect(() => {
        const interceptor = ApiCall.interceptors.response.use(
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
                                return ApiCall(originalRequest);
                            })
                            .catch((err) => {
                                return Promise.reject(err);
                            });
                    }

                    originalRequest._retry = true;
                    setRefresh(true);
                    isRefreshing = true;
                    const encryptedData = await encryptAES(JSON.stringify({ refresh_token: refreshToken }));

                    try {
                        const response = await axios.post('https://hul.indusvision.ai/api/refresh_token/', {
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
            ApiCall.interceptors.response.eject(interceptor);
        };
    }, [refreshToken, accessToken, refresh, dispatch]);

    return ApiCall;
};

export default useApiInterceptor;