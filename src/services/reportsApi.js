import axiosInstance from "../API/axiosInstance";
import axios from "axios";
import { baseURL } from "../API/API";


export const reportApi = async ({ plantId, Authtoken, pageNumber, pageSize }) => {
    try {
        const response = await axiosInstance.get(`https://huldev.aivolved.in/api/reports/?page=${pageNumber}&plant_id=${plantId}&page_size=${pageSize}`, {
            headers: {
                Authorization: `Bearer ${Authtoken}`
            }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};
