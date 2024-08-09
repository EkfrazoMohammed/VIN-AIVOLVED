import axios from 'axios';
import store from '../redux/store';

const ApiCall = axios.create({
    baseURL: 'https://huldev.aivolved.in/api/',
});


ApiCall.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().auth.accessToken; // Get the latest accessToken from the Redux store
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const baseURL = "";
export const AuthToken = "";

export default ApiCall;
