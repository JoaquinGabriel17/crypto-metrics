// src/store/slices/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false,
  notification: null
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    }
  }
});

export const { toggleDarkMode, setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
