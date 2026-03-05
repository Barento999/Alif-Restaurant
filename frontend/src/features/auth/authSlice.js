import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

export const login = createAsyncThunk("auth/login", async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  localStorage.setItem("token", data.data.token);
  localStorage.setItem("user", JSON.stringify(data.data.user));
  return data.data;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user, token, loading: false, error: null },
  reducers: {
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { updateUser } = authSlice.actions;
export default authSlice.reducer;
