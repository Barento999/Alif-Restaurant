import express from "express";
import {
  createCustomerOrder,
  getCustomerOrders,
  getCustomerOrder,
  cancelCustomerOrder,
  getAllCustomerOrders,
  updateCustomerOrderStatus,
} from "../controllers/customerOrderController.js";
import { protectCustomer } from "../middlewares/customerAuth.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Staff routes (admin/manager only)
router.get(
  "/all",
  protect,
  authorize("admin", "manager"),
  getAllCustomerOrders,
);
router.put(
  "/:id/status",
  protect,
  authorize("admin", "manager"),
  updateCustomerOrderStatus,
);

// Customer routes (protected by customer auth)
router.post("/", protectCustomer, createCustomerOrder);
router.get("/", protectCustomer, getCustomerOrders);
router.get("/:id", protectCustomer, getCustomerOrder);
router.put("/:id/cancel", protectCustomer, cancelCustomerOrder);

export default router;
