import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authData: [
    {
      accessToken: null,
      refreshToken: null,
      user: null,
    }
  ],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    setAuthData(state, action) {
      const { access_token, refresh_token, user } = action.payload;
      state.authData = action.payload;
    },
    clearAuthData(state) {
      state.authData = [];
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;

export default authSlice.reducer;
