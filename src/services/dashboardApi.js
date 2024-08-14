import axios from "axios";
import store from "../redux/store"; // Import the store
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

import { getDpmuSuccess, getDpmuFailure } from "../redux/slices/dpmuSlice"; // Import the actions
import {
  getProductVsDefectSuccess,
  getProductVsDefectFailure,
} from "../redux/slices/productvsDefectSlice"; // Import the actions

import {
  getDashboardSuccess,
  setActiveDashboardData,
  getDashboardFailure,
} from "../redux/slices/dashboardSlice";

export const baseURL =
  process.env.REACT_APP_API_BASE_URL || "https://huldev.aivolved.in/api/";

export const getMachines = (plantName, token) => {
  const domain = `${baseURL}`;
  let url = `${domain}machine/?plant_name=${plantName}`;
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

export const getDepartments = (plantName, token) => {
  const domain = `${baseURL}`;
  let url = `${domain}department/?plant_name=${plantName}`;
  axios
    .get(url, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
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

export const getProducts = (plantName, token) => {
  const domain = `${baseURL}`;
  let url = `${domain}product/?plant_name=${plantName}`;
  axios
    .get(url, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
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

export const initialDpmuData = (plantId, token) => {
  const domain = baseURL;
  const url = `${domain}params_graph/?plant_id=${plantId}`;
  axios
    .get(url, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
    .then((response) => {
      store.dispatch(getDpmuSuccess(response.data.results));
      // return response.data.data_last_7_days;
    })
    .catch((error) => {
      console.error("Error:", error);
      store.dispatch(getDpmuFailure());
    });
};

export const initialProductionData = (plantId, token) => {
  const domain = baseURL;
  const url = `${domain}defct-vs-machine/?plant_id=${plantId}`;
  axios
    .get(url, {
      headers: {
        Authorization: ` Bearer ${token}`,
      },
    })
    .then((response) => {
      store.dispatch(getProductVsDefectSuccess(response.data.data_last_7_days));
      // return response.data.data_last_7_days;
    })
    .catch((error) => {
      console.error("Error:", error);
      store.dispatch(getProductVsDefectFailure());
    });
};

export const getSystemStatus = (plantId, token) => {
  const domain = `${baseURL}`;
  let url = `${domain}system-status/?plant_id=${plantId}`;
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      let activeMachines = response.data.results.filter(
        (machine) => machine.system_status === true
      );
      store.dispatch(setActiveMachines(activeMachines));
    })
    .catch((error) => {
      console.error("Error fetching machine data:", error);
    });
};

// export const initialDashboardData = (plantId, token) => {
//   const domain = `${baseURL}`;
//   let url = `${domain}dashboard/?plant_id=${plantId}`;
//   axios
//     .get(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then((response) => {
//       const { active_products, ...datesData } = response.data;
//       console.log(response.data)
//       console.log(datesData)
//       store.dispatch(getDashboardSuccess(...datesData));
//       store.dispatch(setActiveDashboardData(active_products));
//     })
//     .catch((error) => {
//       console.error("Error fetching machine data:", error);
//       store.dispatch(getDashboardFailure());
//     });
// };


export const initialDashboardData = (plantId, token) => {
  const domain = `${baseURL}`;
  const url = `${domain}dashboard/?plant_id=${plantId}`;
  
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      const { active_products, ...datesData } = response.data;
      // Ensure datesData is structured correctly
      store.dispatch(getDashboardSuccess({ datesData, activeProducts: active_products }));
    })
    .catch((error) => {
      console.error("Error fetching machine data:", error);
      store.dispatch(getDashboardFailure(error.message));
    });
};