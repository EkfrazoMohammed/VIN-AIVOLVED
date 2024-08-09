import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApiCall from "../../API/API";
import { login } from "../../redux/slices/authSlice2";
import { CgArrowLongRight } from "react-icons/cg";


const useApiInterceptor = () => {

    const dispatch = useDispatch();
    const refreshToken = useSelector((state) => state.auth.refreshToken);
    const accessToken = useSelector((state) => state.auth.accessToken);
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

                        const { access_token, refresh_token } = response.data;

                        // Update the tokens in Redux state
                        dispatch(login({ accessToken: access_token, refreshToken: refresh_token }));

                        // Update the Authorization header for future requests
                        ApiCall.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
                        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

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
