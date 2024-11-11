//services/dashboardApi.js

import axios from "axios";
import store from "../redux/store"; // Import the store
import useApiInterceptor from "../hooks/useInterceptor";
import {
  decryptAES,
  decryptAESInt,
  encryptAES,
  encryptAESInt,
} from "../redux/middleware/encryptPayloadUtils";

import {
  getMachineSuccess,
  getMachineFailure,
  setActiveMachines,
} from "../redux/slices/machineSlice"; // Import the actions

import {
  getRoleSuccess,
  getRoleFailure,
  setRoleMachines,
} from "../redux/slices/roleSlice"; // Import the actions

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
import { clearConfig } from "dompurify";

export const baseURL =
  process.env.REACT_APP_API_BASE_URL || "https://hul.aivolved.in/api/";

export const getMachines = (plantName, token, apiCallInterceptor) => {
  let encryptedPlantName = encryptAES(plantName).replace(/^"|"$/g, "");
  encryptedPlantName = decodeURIComponent(encryptedPlantName);
  let url = `machine/?plant_name=${encryptedPlantName}`;
  apiCallInterceptor
    .get(url)
    .then((response) => {
      const formattedMachines = response.data.results.map((machine) => ({
        id: machine.id,
        name: machine.name,
      }));
      // Dispatch action to update Redux state
      store.dispatch(getMachineSuccess(formattedMachines));
    })
    .catch((error) => {
      //console.error("Error fetching machine data:", error);
      // Dispatch action to handle failure
      store.dispatch(getMachineFailure());
    });
};

export const getDepartments = (plantName, token, apiCallInterceptor) => {
  let encryptedPlantName = encryptAES(plantName).replace(/^"|"$/g, "");
  encryptedPlantName = decodeURIComponent(encryptedPlantName);
  let url = `department/?plant_name=${encryptedPlantName}`;
  apiCallInterceptor
    .get(url)
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
      //console.error("Error fetching department data:", error);
      // Dispatch action to update Redux state
      store.dispatch(getDepartmentFailure());
    });
};

export const getAverageDpmu = (plantId, apiCallInterceptor, setTextData) => {
  const encryptedPlantId = encryptAES(JSON.stringify(plantId))
  let url = `average-dpmu/?plant_id=${encryptedPlantId}`
  apiCallInterceptor.get(url).then((res) => {
    setTextData(res.data);
  })
    .catch((err) => {
      console.log(err)
    })
}

export const getProducts = (plantName, token, apiCallInterceptor) => {
  let encryptedPlantName = encryptAES(plantName).replace(/^"|"$/g, "");
  encryptedPlantName = decodeURIComponent(encryptedPlantName);
  let url = `product/?plant_name=${encryptedPlantName}`;
  apiCallInterceptor
    .get(url)
    .then((response) => {
      const formattedProduct = response.data.results;
      // Dispatch action to update Redux state
      store.dispatch(getProductSuccess(formattedProduct));
      // return formattedDepartment;
    })
    .catch((error) => {
      //console.error("Error fetching department data:", error);
      // Dispatch action to update Redux state
      store.dispatch(getProductFailure());
    });
};
export const getDefects = (plantName, token, apiCallInterceptor) => {
  let encryptedPlantName = encryptAES(plantName).replace(/^"|"$/g, "");
  encryptedPlantName = decodeURIComponent(encryptedPlantName);

  let url = `defect/?plant_name=${encryptedPlantName}`;

  apiCallInterceptor
    .get(url)
    .then((response) => {
      const formattedDefects = response.data.results;
      store.dispatch(getDefectSuccess(formattedDefects));
    })
    .catch((error) => {
      //console.error("Error fetching department data:", error);
      // Dispatch action to update Redux state
      store.dispatch(getDefectFailure());
    });
};

export const getAiSmartView = async (
  plantId,
  token,
  apiCallInterceptor,
  currentPage,
  defectId
) => {
  // Encrypt the values and then URL encode them
  const encryptedPlantId = encodeURIComponent(
    encryptAES(JSON.stringify(plantId))
  );
  const encryptedDefectId = encodeURIComponent(
    encryptAES(JSON.stringify(defectId))
  );
  const url = `ai-smart/?plant_id=${encryptedPlantId}&defect_id=${encryptedDefectId}&page=${currentPage}`;
  try {
    const response = await apiCallInterceptor.get(url);
    const formattedDefects = response.data;

    return formattedDefects; // Return the data to be used in the calling function
  } catch (error) {
    //console.error("Error fetching AI Smart View data:", error);
    throw error; // Rethrow the error to be caught by the calling function
  }
};


export const initialDpmuData = (plantId, token, apiCallInterceptor) => {
  const encryptedPlantId = encodeURIComponent(
    encryptAES(JSON.stringify(plantId))
  );
  const url = `params_graph/?plant_id=${encryptedPlantId}`;
  apiCallInterceptor
    .get(url)
    .then((response) => {
      const filteredProductionData = response.data.results?.filter((item) => {
        const itemDate = new Date(item.date_time);
        const currentDate = new Date();
        const diffInTime = currentDate - itemDate;
        const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert time difference from milliseconds to days

        return diffInDays <= 15; // Only include data from the last 30 days
      });
      store.dispatch(getDpmuSuccess(filteredProductionData));
    })
    .catch((error) => {
      //console.error("Error:", error);
      store.dispatch(getDpmuFailure());
    });
};

export const dpmuFilterData = (apiCallInterceptor, machineId, plantId, dateRange, selectedDate) => {
  console.log('filtered dpmu')
  const encrypt = encryptAES(JSON.stringify(machineId));
  const encryptedPlantId = encodeURIComponent(
    encryptAES(JSON.stringify(plantId))
  );
  let url;
  if (machineId && machineId !== null) {
    url = `params_graph/?plant_id=${encryptedPlantId}&machine_id=${encrypt}`;
  }
  else {
    url = `params_graph/?plant_id=${encryptedPlantId}`;

  }
  apiCallInterceptor.get(url)
    .then((response) => {
      if (!selectedDate) {
        store.dispatch(getDpmuSuccess(response.data.results.slice(-15)));
      }
      else {
        const [fromDate, toDate] = dateRange;
        const from = new Date(fromDate);
        const to = new Date(toDate);

        const filteredData = response.data.results.filter((item) => {
          const itemDate = new Date(item.date_time); // Convert item date to Date object
          return itemDate >= from && itemDate <= to; // Check if itemDate is within the range
        });
    
        store.dispatch(getDpmuSuccess(filteredData));
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      store.dispatch(getDpmuFailure());
    });
};





export const initialProductionData = (plantId, token, apiCallInterceptor) => {
  const encryptedPlantId = encodeURIComponent(
    encryptAES(JSON.stringify(plantId))
  );
  const url = `defct-vs-machine/?plant_id=${encryptedPlantId}`;
  apiCallInterceptor
    .get(url)
    .then((response) => {
      // console.log(response.data.data_last_7_days.toSpliced(0,1))
      store.dispatch(getProductVsDefectSuccess(response.data.data_last_7_days.toSpliced(0,1)));
      // return response.data.data_last_7_days;
    })
    .catch((error) => {
      //console.error("Error:", error);
      store.dispatch(getProductVsDefectFailure());
    });
};

export const getSystemStatus = (plantId, token, apiCallInterceptor) => {
  const domain = `${baseURL}`;
  const encryptedPlantId = encodeURIComponent(
    encryptAES(JSON.stringify(plantId))
  );

  let url = `${domain}system-status/?plant_id=${encryptedPlantId}`;
  apiCallInterceptor
    .get(url)
    .then((response) => {
      let activeMachines = response.data.results.filter(
        (machine) => machine.system_status === true
      );
      store.dispatch(setActiveMachines(activeMachines));
    })
    .catch((error) => {
      //console.error("Error fetching machine data:", error);
      store.dispatch(setActiveMachines([]));
    });
};

export const getRoles = (token, apiCallInterceptor) => {
  let url = `role/`;
  apiCallInterceptor
    .get(url)
    .then((response) => {
      const formattedDefects = response.data.results;
      store.dispatch(getRoleSuccess(formattedDefects));
    })
    .catch((error) => {
      console.error("Error fetching role data:", error);
      // Dispatch action to update Redux state
      store.dispatch(getRoleFailure());
    });
};

const isEmptyDashboardResponse = (data) => {
  return (
    data &&
    data.active_products &&
    Array.isArray(data.active_products) &&
    data.active_products.length === 0 &&
    Object.keys(data).length === 1
  );
};

export const initialDashboardData = (plantId, token, apiCallInterceptor) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6); // 7 days ago
  const formattedStartDate = startDate.toISOString().slice(0, 10);
  // Format startDate as YYYY-MM-DD

  const endDate = new Date(); // Today's date
  const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD

  const encryptedPlantId = encodeURIComponent(
    encryptAES(JSON.stringify(plantId))
  );
  const encryptedfromDate = encodeURIComponent(encryptAES(formattedStartDate));
  const encryptedtodate = encodeURIComponent(encryptAES(formattedEndDate));

  const url = `dashboard/?plant_id=${encryptedPlantId}&from_date=${encryptedfromDate}&to_date=${encryptedtodate}`;
  apiCallInterceptor
    .get(url)
    .then((response) => {
      const { active_products, ...datesData } = response.data;

      if (isEmptyDashboardResponse(response.data)) {
        store.dispatch(getDashboardFailure("No meaningful data available."));
      } else {
        store.dispatch(
          getDashboardSuccess({ datesData, activeProducts: active_products })
        );
      }
    })
    .catch((error) => {
      //console.error("Error fetching dashboard data:", error);
      store.dispatch(getDashboardFailure(error.message));
    });
};



// FILTER DATA IN FRONTEND DPMU AS PER THE DATE


// export const dpmuFilterDate = (plantId, apiCallInterceptor, dateRange) => {
//   const encryptedPlantId = encodeURIComponent(
//     encryptAES(JSON.stringify(plantId))
//   );
//   const url = `params_graph/?plant_id=${encryptedPlantId}`;
//   apiCallInterceptor
//     .get(url)
//     .then((response) => {
//       const [fromDate, toDate] = dateRange;

//       // Convert 'fromDate' and 'toDate' into JavaScript Date objects
//       const from = new Date(fromDate);
//       const to = new Date(toDate);

//       // Filter the response data based on the date range
//       const filteredData = response.data.results.filter((item) => {
//         const itemDate = new Date(item.date_time); // Convert item date to Date object
//         return itemDate >= from && itemDate <= to; // Check if itemDate is within the range
//       });

//       // Log the filtered results
//       console.log('Filtered Data:', filteredData);
//       store.dispatch(getDpmuSuccess(filteredData));
//     })
//     .catch((error) => {
//       //console.error("Error:", error);
//       store.dispatch(getDpmuFailure());
//     });
// };

export const dpmuFilterDate = async (DpmuData, dateRange) => {
  try {
    const [fromDate, toDate] = dateRange;
    const from = new Date(fromDate);
    const to = new Date(toDate);


    const filteredData = DpmuData.filter((item) => {
      const itemDate = new Date(item.date_time); // Convert item date to Date object
      return itemDate >= from && itemDate <= to; // Check if itemDate is within the range
    });

    // Log the filtered results
    store.dispatch(getDpmuSuccess(filteredData));
  } catch (error) {

  }
}