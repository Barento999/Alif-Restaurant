import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchMenu = createAsyncThunk("menu/fetch", async () => {
  const { data } = await api.get("/menu");
  return data.data;
});

const menuSlice = createSlice({
  name: "menu",
  initialState: { items: [], loading: false },
  extraReducers: (builder) => {
    builder.addCase(fetchMenu.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default menuSlice.reducer;
