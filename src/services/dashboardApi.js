//services/dashboardApi.js

import store from "../redux/store"; // Import the store
import {

  encryptAES,

} from "../redux/middleware/encryptPayloadUtils";

import {
  getMachineSuccess,
  getMachineFailure,
  setActiveMachines,
  setLoading,
} from "../redux/slices/machineSlice"; // Import the actions

import {
  getRoleSuccess,
  getRoleFailure,
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
  process.env.REACT_APP_API_BASE_URL || "https://hul.aivolved.in/api/";

export const getMachines = (plantName, token, apiCallInterceptor) => {
  store.dispatch(setLoading(true))
  let encryptedPlantName = encryptAES(plantName).replace(/^"|"$|^"+$/g, "");

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
      store.dispatch(setLoading(false))
      store.dispatch(getMachineSuccess(formattedMachines));

    })
    .catch((error) => {
      //console.error("Error fetching machine data:", error);
      // Dispatch action to handle failure
      store.dispatch(getMachineFailure());
    });
};

export const getDepartments = (plantName, token, apiCallInterceptor) => {
  let encryptedPlantName = encryptAES(plantName).replace(/^"|"$|^"+$/g, "");

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

export const getAverageDpmuCount =async (plantId, apiCallInterceptor, setCountData ) => {
  const encryptedPlantId = encryptAES(JSON.stringify(plantId))
  // let url = `average-dpmu/?plant_id=${encryptedPlantId}`
  const url = `params_graph/?plant_id=${encryptedPlantId}`;
  try {
    const response =  await apiCallInterceptor.get(url)
    const fullData = await response.data.results?.filter((item) => {
      const itemDate = new Date(item.date_time);
      const currentDate = new Date();
      const diffInTime = currentDate - itemDate;
      const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert time difference from milliseconds to days
      return diffInDays <= 31; // Only include data from the last 30 days
    });
    // const fullData =  response.data.results.slice(-29)
    console.log(fullData)
    const totalData = fullData.reduce((accumulator, item) => {
      return accumulator + item.defect_percentage;
    }, 0);
    setCountData(totalData/30);
    // dispatchReducer({type:"SET_COUNTDATA",payload:totalData})
  } catch (error) {
    console.log(error)
  }

}
export const getAverageDpmu =async (plantId, apiCallInterceptor, setTextData) => {
  const encryptedPlantId = encryptAES(JSON.stringify(plantId))
  let url = `average-dpmu/?plant_id=${encryptedPlantId}`;
  // const url = `params_graph/?plant_id=${encryptedPlantId}`;
  try {
    const response =  await apiCallInterceptor.get(url)
    // const fullData =  response.data.results.slice(-30)
    // const totalData = fullData.reduce((accumulator, item) => {
    //   return accumulator + item.defect_percentage;
    // }, 0);
    setTextData(response.data);
  } catch (error) {
    console.log(error)
  }

}

export const getProducts = (plantName, token, apiCallInterceptor) => {
  let encryptedPlantName = encryptAES(plantName).replace(/^"|"$|^"+$/g, "");

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
      // Dispatch action to update Redux state
      store.dispatch(getProductFailure());
    });
};
export const getDefects = (plantName, token, apiCallInterceptor) => {
  let encryptedPlantName = encryptAES(plantName).replace(/^"|"$|^"+$/g, "");
  encryptedPlantName = decodeURIComponent(encryptedPlantName);

  let url = `defect/?plant_name=${encryptedPlantName}`;

  apiCallInterceptor
    .get(url)
    .then((response) => {
      const formattedDefects = response.data.results;
      store.dispatch(getDefectSuccess(formattedDefects));
    })
    .catch((error) => {
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
    throw new Error(` ${error}`);
  }
};


export const initialDpmuData = async(plantId, token, apiCallInterceptor,setCountData) => {
  const encryptedPlantId = encodeURIComponent(
    encryptAES(JSON.stringify(plantId))
  );
  const url = `params_graph/?plant_id=${encryptedPlantId}`;
  try {
    const response = await apiCallInterceptor.get(url);
       const filteredProductionData = await response.data.results?.filter((item) => {
      const itemDate = new Date(item.date_time);
      const currentDate = new Date();
      const diffInTime = currentDate - itemDate;
      const diffInDays = diffInTime / (1000 * 3600 * 24); // Convert time difference from milliseconds to days
      return diffInDays <= 15; // Only include data from the last 30 days
    }
  );

  return filteredProductionData
  } catch (error) {
    return error
  }
};

export const dpmuFilterData = async(apiCallInterceptor, machineId, plantId, dateRange, selectedDate) => {
 let dpmuData ;
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
  try {
    const response = await apiCallInterceptor.get(url);
    if (!selectedDate) {
      // store.dispatch(getDpmuSuccess(response.data.results.slice(-15)));
       const fullData =  response.data.results
       dpmuData  = response.data.results.slice(-15)
      return {dpmuData ,fullData}
    }
    else {
      const [fromDate, toDate] = dateRange;
      const from = new Date(fromDate);
      const to = new Date(toDate);
  
       dpmuData = response.data.results.filter((item) => {
        const itemDate = new Date(item.date_time); // Convert item date to Date object
        return itemDate >= from && itemDate <= to; // Check if itemDate is within the range
      });
      // store.dispatch(getDpmuSuccess(filteredData))
    } 
    return dpmuData
  } catch (error) {
    return error
  }
};





export const initialProductionData = async(plantId, token, apiCallInterceptor) => {
  const encryptedPlantId = encodeURIComponent(
    encryptAES(JSON.stringify(plantId))
  );
  const url = `defct-vs-machine/?plant_id=${encryptedPlantId}`;
  try {
    const response = await apiCallInterceptor(url);
    const prodData = response.data.data_last_7_days.toSpliced(0,1)
    return prodData
  } catch (error) {
    return error
  }
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
   
    data?.active_products &&
    Array?.isArray(data.active_products) &&
    data?.active_products.length === 0 &&
    Object.keys(data).length === 1
    
  );
};


export const initialDashboardData = async (plantId, token, apiCallInterceptor) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6); // 7 days ago
  const formattedStartDate = startDate.toISOString().slice(0, 10);

  const endDate = new Date(); // Today's date
  const formattedEndDate = endDate.toISOString().slice(0, 10); // Format endDate as YYYY-MM-DD

  const encryptedPlantId = encodeURIComponent(   encryptAES(JSON.stringify(plantId))
  );
  const encryptedfromDate = encodeURIComponent(encryptAES(formattedStartDate));
  const encryptedtodate = encodeURIComponent(encryptAES(formattedEndDate));
  const url = `dashboard/?plant_id=${encryptedPlantId}&from_date=${encryptedfromDate}&to_date=${encryptedtodate}`;
  try {
    const response = await apiCallInterceptor.get(url);
    const { active_products, ...datesData } = response.data;
          // if (isEmptyDashboardResponse(response.data)) {
          //   // store.dispatch(getDashboardFailure("No meaningful data available."));
          //   return 
          // } else {
          //   store.dispatch(
          //     getDashboardSuccess({ datesData, activeProducts: active_products })
          //   );
          // }
          return response.data
  } catch (error) {
    // store.dispatch(getDashboardFailure(error.message));
    return error?.message
  }
};
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
    throw new Error(` ${error}`);

  }
}