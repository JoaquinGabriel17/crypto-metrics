// src/store/slices/cryptoSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cryptos: [], // Lista de criptos con precios
  loading: false,
  error: null
};

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    setCryptos: (state, action) => {
      state.cryptos = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateCryptoPrice: (state, action) => {
      const { id, newPrice } = action.payload;
      const crypto = state.cryptos.find(c => c.id === id);
      if (crypto) {
        crypto.price = newPrice;
      }
    }
  }
});

export const { setCryptos, setLoading, setError, updateCryptoPrice } = cryptoSlice.actions;
export default cryptoSlice.reducer;
