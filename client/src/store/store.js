import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import profileReducer from "./reducers/profileReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
});

export default store;
