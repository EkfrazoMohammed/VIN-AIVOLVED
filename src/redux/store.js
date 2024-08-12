import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { encryptTransform } from 'redux-persist-transform-encrypt';
import authReducer from './slices/authSlice';
import plantReducer from './slices/plantSlice';
// Encryption Configuration
const encryptor = encryptTransform({
  secretKey: 'V!N_P0ND!', // Make sure to set this in your .env
  onError: function(error) {
    // Handle the error
    console.error("Encryption error:", error);
  },
});

// Persist Configurations for each slice
const authPersistConfig = {
  key: 'auth',
  storage,
  transforms: [encryptor],
};

const plantPersistConfig = {
  key: 'plant',
  storage,
  transforms: [encryptor],
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
