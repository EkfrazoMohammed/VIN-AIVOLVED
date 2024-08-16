import axios from 'axios';
import store from '../redux/store';

const ApiCall = axios.create({
    baseURL: 'https://huldev.aivolved.in/api/',
});

ApiCall.interceptors.request.use(
    (config) => {
        const accessToken = store.getState().auth.authData[0].accessToken; // Get the latest accessToken
        // const accessToken = useSelector((state) => state.auth.authData[0].accessToken); from the Redux store
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default ApiCall;