import axios from "axios";
import store from "../redux/store"; // Import the store
import useApiInterceptor from "../hooks/useInterceptor";
import { decryptAES, encryptAES } from "../redux/middleware/encryptPayloadUtils";

import {
  getMachineSuccess,
  getMachineFailure,
  setActiveMachines,
} from "../redux/slices/machineSlice"; // Import the actions
import {
  getDepartmentSuccess,
  getDepartmentFailure,
} from "../redux/slices/departmentSlice"; // Import the actions
import {
  getProductSuccess,
  getProductFailure,
} from "../redux/slices/productSlice"; // Import the actions

import {
  getDefectSuccess,
  getDefectFailure,
  setSelectedDefect,
} from "../redux/slices/defectSlice"; // Import the actions

import { getDpmuSuccess, getDpmuFailure } from "../redux/slices/dpmuSlice"; // Import the actions
import {
  getProductVsDefectSuccess,
  getProductVsDefectFailure,
} from "../redux/slices/productvsDefectSlice"; // Import the actions

import {
  getDashboardSuccess,
  getDashboardFailure,
} from "../redux/slices/dashboardSlice";


export const baseURL =
  process.env.REACT_APP_API_BASE_URL || "https://huldev.aivolved.in/api/";


export const getMachines = (plantName, token, apiCallInterceptor) => {
  const encryptedData = encryptAES(plantName)
  const domain = `${baseURL}`;
  // let url = `${domain}machine/?plant_name=${plantName}`;
  let url = `machine/?plant_name=${encryptedData}`;

  apiCallInterceptor.get(url)
    .then((response) => {
      const formattedMachines = response.data.results.map((machine) => ({
        id: machine.id,
        name: machine.name,
      }));
      // Dispatch action to update Redux state
      store.dispatch(getMachineSuccess(formattedMachines));
    })
    .catch((error) => {
      console.error("Error fetching machine data:", error);
      // Dispatch action to handle failure
      store.dispatch(getMachineFailure());
    });
};

export const getDepartments = (plantName, token, apiCallInterceptor) => {
  const encryptedData = encryptAES(plantName)

  const domain = `${baseURL}`;
  let url = `department/?plant_name=${encryptedData}`;
  // axios
  //   .get(url, {
  //     headers: {
  //       Authorization: ` Bearer ${token}`,
  //     },
  //   })
  apiCallInterceptor.get(url)
    .then((response) => {
      const formattedDepartment = response.data.results.map((department) => ({
        id: department.id,
        name: department.name,
      }));
      // Dispatch action to update Redux state
      store.dispatch(getDepartmentSuccess(formattedDepartment));
      // return formattedDepartment;
    })
    .catch((error) => {
      console.error("Error fetching department data:", error);
      // Dispatch action to update Redux state
      store.dispatch(getDepartmentFailure());
    });
};

export const getProducts = (plantName, token, apiCallInterceptor) => {
  const encryptedData = encryptAES(plantName)

  let url = `product/?plant_name=${encryptedData}`;
  // axios
  //   .get(url, {
  //     headers: {
  //       Authorization: ` Bearer ${token}`,
  //     },
  //   })
  apiCallInterceptor.get(url)
    .then((response) => {
      const formattedProduct = response.data.results;
      // Dispatch action to update Redux state
      store.dispatch(getProductSuccess(formattedProduct));
      // return formattedDepartment;
    })
    .catch((error) => {
      console.error("Error fetching department data:", error);
      // Dispatch action to update Redux state
      store.dispatch(getProductFailure());
    });
};
export const getDefects = (plantName, token, apiCallInterceptor) => {
  const encryptedData = encryptAES(plantName)

  let url = `defect/?plant_name=${encryptedData}`;
  // axios
  //   .get(url, {
  //     headers: {
  //       Authorization: ` Bearer ${token}`,
  //     },
  //   })
  apiCallInterceptor.get(url)
    .then((response) => {
      const formattedDefects = response.data.results;
      store.dispatch(getDefectSuccess(formattedDefects));

    })
    .catch((error) => {
      console.error("Error fetching department data:", error);
      // Dispatch action to update Redux state
      store.dispatch(getDefectFailure());
    });
};

export const initialDpmuData = (plantId, token, apiCallInterceptor) => {
  const url = `params_graph/?plant_id=${plantId}`;
  // axios
  //   .get(url, {
  //     headers: {
  //       Authorization: ` Bearer ${token}`,
  //     },
  //   })
  apiCallInterceptor.get(url)
    .then((response) => {
      store.dispatch(getDpmuSuccess(response.data.results));
      // return response.data.data_last_7_days;
    })
    .catch((error) => {
      console.error("Error:", error);
      store.dispatch(getDpmuFailure());
    });
};

export const initialProductionData = (plantId, token, apiCallInterceptor) => {

  const domain = baseURL;
  const url = `defct-vs-machine/?plant_id=${plantId}`;
  // axios
  //   .get(url, {
  //     headers: {
  //       Authorization: ` Bearer ${token}`,
  //     },
  //   })
  apiCallInterceptor.get(url)
    .then((response) => {
      store.dispatch(getProductVsDefectSuccess(response.data.data_last_7_days));
      // return response.data.data_last_7_days;
    })
    .catch((error) => {
      console.error("Error:", error);
      store.dispatch(getProductVsDefectFailure());
    });
};

export const getSystemStatus = (plantId, token, apiCallInterceptor) => {
  const domain = `${baseURL}`;
  let url = `${domain}system-status/?plant_id=${plantId}`;
  // axios
  //   .get(url, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  apiCallInterceptor.get(url)
    .then((response) => {
      let activeMachines = response.data.results.filter(
        (machine) => machine.system_status === true
      );
      store.dispatch(setActiveMachines(activeMachines));
    })
    .catch((error) => {
      console.error("Error fetching machine data:", error);
      store.dispatch(setActiveMachines([]));
    });
};
const isEmptyDashboardResponse = (data) => {
  return data && data.active_products && Array.isArray(data.active_products) && data.active_products.length === 0
    && Object.keys(data).length === 1;
};


export const initialDashboardData = (plantId, token, apiCallInterceptor) => {
  const domain = `${baseURL}`;
  // const url = `${domain}dashboard/?plant_id=${plantId}`;
  const url = `dashboard/?plant_id=${plantId}`;
  // axios
  //   .get(url, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  apiCallInterceptor.get(url)
    .then((response) => {
      const { active_products, ...datesData } = response.data;

      if (isEmptyDashboardResponse(response.data)) {
        store.dispatch(getDashboardFailure('No meaningful data available.'));
      } else {
        store.dispatch(getDashboardSuccess({ datesData, activeProducts: active_products }));
      }
    })
    .catch((error) => {
      console.error("Error fetching dashboard data:", error);
      store.dispatch(getDashboardFailure(error.message));
    });
};