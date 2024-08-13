import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiCall from "../API/Apicall";
import { setAuthData } from "../redux/slices/authSlice";


const useApiInterceptor = () => {

    const dispatch = useDispatch();
    const refreshToken = useSelector((state) => state.auth.authData.refresh_token);
    const accessToken = useSelector((state) => state.auth.authData.access_token);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {

        const interceptor = ApiCall.interceptors.response.use(
            (response) => response,

            async (error) => {
                const originalRequest = error.config;

                if (error.response.status === 401 && !originalRequest._retry) {

                    if (!refresh) {
                        originalRequest._retry = true;
                        setRefresh(true);
                    }

                    try {
                        const response = await ApiCall.post('refresh_token/', {
                            refresh: refreshToken,
                        });

                        const { access } = response.data;

                        // Update the tokens in Redux state
                        // { access_token, refresh_token, user }
                        // dispatch(setAuthData({ access_token: access, refresh_token: refreshToken }));

                        // Update the Authorization header for future requests
                        ApiCall.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access}`;

                        return ApiCall(originalRequest);
                    } catch (refreshError) {
                        console.error("Error in Refreshing Token:", refreshError);
                        return Promise.reject(refreshError);
                    } finally {
                        setRefresh(false);
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