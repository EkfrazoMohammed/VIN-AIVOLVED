import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // Use sessionStorage

import authReducer from './slices/authSlice';
import plantReducer from './slices/plantSlice'; // Import plant slice

const persistConfig = {
  key: 'root',
  storage: sessionStorage, 
};

// Wrap individual reducers with persistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedPlantReducer = persistReducer(persistConfig, plantReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    plant: persistedPlantReducer,
  },
});

export const persistor = persistStore(store);
export default store;
