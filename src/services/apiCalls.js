import useAxiosInstance from "../API/useAxiosInstance";
import {
  getMachinesEndpoint,
  getProductsEndpoint,
  getDashboardDataEndpoint,
  getDefectVsMachineEndpoint,
  getDefectsEndpoint
} from "./endpoints";

// Fetch defects using a hook
export const useFetchDefects = () => {
  const axiosInstance = useAxiosInstance();

  return async () => {
    try {
      const url = getDefectsEndpoint();
      const response = await axiosInstance.get(url);
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      throw new Error(`Failed to fetch defects: ${error.message}`);
    }
  };
};

// Fetch machines using a hook
export const useFetchMachines = (plantName) => {
  const axiosInstance = useAxiosInstance();

  return async () => {
    try {
      const url = getMachinesEndpoint(plantName);
      const response = await axiosInstance.get(url);
      let data = response.data.results.map((machine) => ({
        id: machine.id,
        name: machine.name,
      }));
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch defects: ${error.message}`);
    }
  };
};

// Fetch products using a hook
export const useFetchProducts = (plantName) => {
  const axiosInstance = useAxiosInstance();

  return async () => {
    try {
      const url = getProductsEndpoint(plantName);
      const response = await axiosInstance.get(url);
      return response.data.results;
    } catch (error) {
      throw new Error(`Failed to fetch defects: ${error.message}`);

    }
  };
};

// Fetch dashboard data using a hook
export const useFetchDashboardData = (plantId) => {
  const axiosInstance = useAxiosInstance();

  return async () => {
    try {
      const url = getDashboardDataEndpoint(plantId);
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch defects: ${error.message}`);

    }
  };
};

// Fetch defect vs machine data using a hook
export const useFetchDefectVsMachineData = (plantId) => {
  const axiosInstance = useAxiosInstance();

  return async () => {
    try {
      const url = getDefectVsMachineEndpoint(plantId);
      const response = await axiosInstance.get(url);
      return response.data.data_last_7_days;
    } catch (error) {
      throw new Error(`Failed to fetch defects: ${error.message}`);

    }
  };
};
