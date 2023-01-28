import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    name: null,
    image: null,
    username: null,
    bio: null,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload.name;
    },
    setImage: (state, action) => {
      state.image = action.payload.image;
    },
    setUsername: (state, action) => {
      state.username = action.payload.username;
    },
    setBio: (state, action) => {
      state.bio = action.payload.bio;
    },
  },
});

export const { setName, setImage, setUsername, setBio } = profileSlice.actions;

export default profileSlice.reducer;
