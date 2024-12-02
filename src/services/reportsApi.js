
import { encryptAES } from ".././redux/middleware/encryptPayloadUtils"

export const reportApi = async (plantId, pageSize, Authtoken, pageNumber, apiCallInterceptor) => {
    try {
        const encryptedData = encryptAES(JSON.stringify(plantId))
        const response = await apiCallInterceptor.get(`reports/?page=${pageNumber}&plant_id=${encryptedData}&page_size=${pageSize}`);
        return response.data;
    } catch (error) {
        return error;
    }
};



