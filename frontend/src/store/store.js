import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import orderReducer from "../features/orders/orderSlice";
import menuReducer from "../features/menu/menuSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: orderReducer,
    menu: menuReducer,
  },
});
