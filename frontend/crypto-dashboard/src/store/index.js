// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import cryptoReducer from "./slices/cryptoSlice";
import userReducer from "./slices/userSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    user: userReducer,
    ui: uiReducer
  }
});
