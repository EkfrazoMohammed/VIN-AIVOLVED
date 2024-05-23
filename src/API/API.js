import axios from "axios";
const baseURL =  'http://127.0.0.1:8001/';
const API = axios.create({
    baseURL,
})
export {baseURL,API}
