import axios from "axios";
// const baseURL =  'http://127.0.0.1:8001/';
// const baseURL =  'http://vin.aivolved.in:8100/';
const baseURL =  'http://159.65.157.118:8005/';
const API = axios.create({
    baseURL,
})
export {baseURL,API}
