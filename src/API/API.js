import axios from "axios";
const baseURL =  'http://127.0.0.1:8001/';
// const baseURL =  'http://vin.aivolved.in:8100/';
const API = axios.create({
    baseURL,
})
export {baseURL,API}
