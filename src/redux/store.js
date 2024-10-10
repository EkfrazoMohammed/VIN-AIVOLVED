import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage"; // For LocalStorage
// import sessionStorage from "redux-persist/lib/storage/session"; // For sessionStorage
import localStoragePersist from "redux-persist/lib/storage"; // For localStorage
import sessionStoragePersist from "redux-persist/lib/storage/session"; // For sessionStorage
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import rolesReducer from "./slices/roleSlice";
import locationReducer from "./slices/locationSlice";
import plantReducer from "./slices/plantSlice";
import dashboardReducer from "./slices/dashboardSlice";
import machineReducer from "./slices/machineSlice";
import productReducer from "./slices/productSlice";
import shiftReducer from "./slices/shiftSlice";
import departmentReducer from "./slices/departmentSlice";
import dpmuReducer from "./slices/dpmuSlice";
import productVsDefectReducer from "./slices/productvsDefectSlice";
import reportReducer from "./slices/reportSlice";
import defectReducer from "./slices/defectSlice";
import aismartviewReducer from "./slices/aismartviewSlice";
import defectTriggerReducer from "./slices/defecTriggerSlice";

// Encryption Configuration
const encryptor = encryptTransform({
  secretKey: process.env.REACT_APP_ENCRYPTION_KEY || "V!N_P0ND!", // Ensure secret key is set in .env
  onError: function (error) {
    // Handle the error
    console.error("Encryption error:", error);
  },
});

// Determine storage based on localStorage value
// const savingStorage =
//   localStorage.getItem("rememberMeClicked") === "true"
//     ? storage
//     : sessionStorage;
// Function to get storage based on "rememberMeClicked" value
const getStorage = () => {
  return localStorage.getItem("rememberMeClicked") === "true"
    ? localStoragePersist
    : sessionStoragePersist;
};

// Persist Configurations for each slice
const createPersistConfig = (key) => ({
  key,
  storage: getStorage(), // Make sure to assign it correctly
  transforms: [encryptor],
});

// Combine reducers with persist configurations
const rootReducer = {
  auth: persistReducer(createPersistConfig("auth"), authReducer),
  user: persistReducer(createPersistConfig("user"), userReducer),
  role: persistReducer(createPersistConfig("role"), rolesReducer),
  location: persistReducer(createPersistConfig("location"), locationReducer),
  plant: persistReducer(createPersistConfig("plant"), plantReducer),
  report: persistReducer(createPersistConfig("report"), reportReducer),
  dashboard: persistReducer(createPersistConfig("dashboard"), dashboardReducer),
  machine: persistReducer(createPersistConfig("machine"), machineReducer),
  product: persistReducer(createPersistConfig("product"), productReducer),
  shift: persistReducer(createPersistConfig("shift"), shiftReducer),
  department: persistReducer(createPersistConfig("department"), departmentReducer),
  dpmu: persistReducer(createPersistConfig("dpmu"), dpmuReducer),
  productVsDefect: persistReducer(createPersistConfig("productVsDefect"), productVsDefectReducer),
  defect: persistReducer(createPersistConfig("defect"), defectReducer),
  aismartview: persistReducer(createPersistConfig("aismartview"), aismartviewReducer),
  defectTrigger: persistReducer(createPersistConfig("defectTrigger"), defectTriggerReducer)
};

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necessary for Redux Persist
      thunk: true, // Make sure thunk is enabled if you're using async actions
    }),
});

// Create a persistor
export const persistor = persistStore(store);
export default store;
