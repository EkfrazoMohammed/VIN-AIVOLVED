import axiosInstance from "../API/axiosInstance";
import axios from "axios";
import { baseURL } from "../API/API";
import { encryptAES } from ".././redux/middleware/encryptPayloadUtils"

export const reportApi = async (plantId, pageSize, Authtoken, pageNumber, apiCallInterceptor) => {
    try {
        const encryptedData = encryptAES(JSON.stringify(plantId))

        const response = await apiCallInterceptor.get(`reports/?page=${pageNumber}&plant_id=${encryptedData}&page_size=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error(error);
        return error;
    }
};



