import axiosInstance from "../API/axiosInstance";
import axios from "axios";
import { baseURL } from "../API/API";


export const reportApi = async (plantId, pageSize, Authtoken, pageNumber, apiCallInterceptor) => {
    try {
        const response = await apiCallInterceptor.get(`reports/?page=${pageNumber}&plant_id=${plantId}&page_size=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};
