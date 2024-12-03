import axios from "axios";
// const   baseURL =  'http://159.65.157.118:8006/api/';
// const   baseURL =  'https://huldev.aivolved.in/api/';
// const baseURL =  'http://vin.aivolved.in:8100/';
// const baseURL =  'http://159.65.157.118:8005/';



const baseURL = 'http://localhost:8000/api/';

const token = localStorage.getItem("token");
const accessToken = JSON.parse(token)
const localItems = localStorage.getItem("PlantData")
const localPlantData = JSON.parse(localItems)

const API = axios.create({
    baseURL,
})

API.interceptors.request.use(
    (config) => {
        // const accessToken = store.getState().auth.authData[0].accessToken; // Get the latest accessToken
        // const accessToken = useSelector((state) => state.auth.authData[0].accessToken); from the Redux store
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(new Error(error));
    }
);

export { baseURL, API, accessToken, localPlantData }

export default API;