import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    name: null,
    image: null,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload.name;
    },
    setImage: (state, action) => {
      state.image = action.payload.image;
    },
  },
});

export const { setName, setImage } = profileSlice.actions;

export default profileSlice.reducer;
