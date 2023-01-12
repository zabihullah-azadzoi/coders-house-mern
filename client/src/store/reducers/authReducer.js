import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuth: false,
    user: null,
    otp: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.isAuth = true;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
  },
});

export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;
