import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import rolesReducer from "./slices/roleSlice";
import locationReducer from "./slices/locationSlice";
import plantReducer from "./slices/plantSlice";
import dashboardReducer from "./slices/dashboardSlice";
import machineReducer from "./slices/machineSlice";
import productReducer from "./slices/productSlice";
import departmentReducer from "./slices/departmentSlice";
import dpmuReducer from "./slices/dpmuSlice";
import productVsDefectReducer from "./slices/productvsDefectSlice";
import reportReducer from "./slices/reportSlice";
import defectReducer from "./slices/defectSlice";
import aismartviewReducer from "./slices/aismartviewSlice";

// Encryption Configuration
const encryptor = encryptTransform({
  secretKey: process.env.REACT_APP_ENCRYPTION_KEY || "V!N_P0ND!", // Ensure secret key is set in .env
  onError: function (error) {
    // Handle the error
    //console.error("Encryption error:", error);
  },
});

// Persist Configurations for each slice
const authPersistConfig = {
  key: "auth",
  storage,
  transforms: [encryptor],
};
const userPersistConfig = {
  key: "user",
  storage,
  transforms: [encryptor],
};

const rolePersistConfig = {
  key: "role",
  storage,
  transforms: [encryptor],
};

const plantPersistConfig = {
  key: "plant",
  storage,
  transforms: [encryptor],
};

const locationPersistConfig = {
  key: "location",
  storage,
  transforms: [encryptor],
};

const machinePersistConfig = {
  key: "machine",
  storage,
  transforms: [encryptor],
};
const productPersistConfig = {
  key: "product",
  storage,
  transforms: [encryptor],
};

const departmentPersistConfig = {
  key: "department",
  storage,
  transforms: [encryptor],
};
const dpmuPersistConfig = {
  key: "dpmu",
  storage,
  transforms: [encryptor],
};
const productVsDefectPersistConfig = {
  key: "productVsDefect",
  storage,
  transforms: [encryptor],
};
const dashboardPersistConfig = {
  key: "dashboard",
  storage,
  transforms: [encryptor],
};
const reportPersistConfig = {
  key: "report",
  storage,
  transforms: [encryptor],
};
const defectPersistConfig = {
  key: "defect",
  storage,
  transforms: [encryptor],
};
const aismartviewPersistConfig = {
  key: "aismartview",
  storage,
  transforms: [encryptor],
};

// Combine reducers
const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
  role: persistReducer(rolePersistConfig, rolesReducer),
  location: persistReducer(locationPersistConfig, locationReducer),
  plant: persistReducer(plantPersistConfig, plantReducer),
  report: persistReducer(reportPersistConfig, reportReducer),
  dashboard: persistReducer(dashboardPersistConfig, dashboardReducer),
  machine: persistReducer(machinePersistConfig, machineReducer),
  product: persistReducer(productPersistConfig, productReducer),
  department: persistReducer(departmentPersistConfig, departmentReducer),
  dpmu: persistReducer(dpmuPersistConfig, dpmuReducer),
  productVsDefect: persistReducer(
    productVsDefectPersistConfig,
    productVsDefectReducer
  ),
  defect: persistReducer(defectPersistConfig, defectReducer),
  aismartview: persistReducer(aismartviewPersistConfig, aismartviewReducer),
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
