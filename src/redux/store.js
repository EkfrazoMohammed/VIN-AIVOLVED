import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Use sessionStorage
import authReducer from './slices/authSlice';
import plantReducer from './slices/plantSlice';

// Persist Configurations for each slice
const authPersistConfig = {
  key: 'auth',
  storage,
};

const plantPersistConfig = {
  key: 'plant',
  storage,
};

// Combine reducers
const rootReducer = {
  auth: persistReducer(authPersistConfig, authReducer),
  plant: persistReducer(plantPersistConfig, plantReducer),
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necessary for Redux Persist
    }),
});

export const persistor = persistStore(store);
export default store;
