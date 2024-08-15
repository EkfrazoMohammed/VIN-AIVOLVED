import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: [
    {
      userId: null,
      firstName: "",
      lastName: "",
      userName: "",
      isSuperuser: false,
    }
  ],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userSignInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    userSignInSuccess: (state, action) => {
      state.userData[0].userId = action.payload.userId;
      state.userData[0].firstName = action.payload.firstName;
      state.userData[0].lastName = action.payload.lastName;
      state.userData[0].userName = action.payload.userName;
      state.userData[0].isSuperuser = action.payload.isSuperuser;
    },
    userSignInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userSignOut: (state) => {
      state.userData[0].userId = null;
      state.userData[0].firstName = "";
      state.userData[0].lastName = "";
      state.userData[0].userName = "";
      state.userData[0].isSuperuser = false;
    },
  },
});

export const { userSignInStart, userSignInSuccess, userSignInFailure, userSignOut } =
  userSlice.actions;

export default userSlice.reducer;
