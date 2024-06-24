import axios from "axios";
// const   baseURL =  'http://159.65.157.118:8006/api/';
const   baseURL =  'https://hul.aivolved.in/api/';
// const baseURL =  'http://vin.aivolved.in:8100/';
// const baseURL =  'http://159.65.157.118:8005/';
const token = localStorage.getItem("token");
const AuthToken = JSON.parse(token)
const localItems = localStorage.getItem("PlantData")
const localPlantData = JSON.parse(localItems) 
const API = axios.create({
    baseURL,
})
export {baseURL,API,AuthToken,localPlantData}
