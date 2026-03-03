import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchOrders = createAsyncThunk("orders/fetch", async (status) => {
  const { data } = await api.get("/orders", { params: { status } });
  return data.data;
});

export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData) => {
    const { data } = await api.post("/orders", orderData);
    return data.data;
  },
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }) => {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data.data;
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState: { orders: [], loading: false, error: null },
  reducers: {
    addOrderRealtime: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrderRealtime: (state, action) => {
      const index = state.orders.findIndex((o) => o._id === action.payload._id);
      if (index !== -1) state.orders[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id,
        );
        if (index !== -1) state.orders[index] = action.payload;
      });
  },
});

export const { addOrderRealtime, updateOrderRealtime } = orderSlice.actions;
export default orderSlice.reducer;
