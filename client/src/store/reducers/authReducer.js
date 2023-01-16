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
      if (action.payload.user) {
        state.isAuth = true;
      } else {
        state.isAuth = false;
      }
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
  },
});

export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;
