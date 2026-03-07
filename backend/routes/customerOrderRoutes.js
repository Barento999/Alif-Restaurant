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

// Staff routes (admin/manager/kitchen can view and update)
router.get(
  "/all",
  protect,
  authorize("admin", "manager", "kitchen"),
  getAllCustomerOrders,
);
router.put(
  "/:id/status",
  protect,
  authorize("admin", "manager", "kitchen"),
  updateCustomerOrderStatus,
);

// Customer routes (protected by customer auth)
router.post("/", protectCustomer, createCustomerOrder);
router.get("/", protectCustomer, getCustomerOrders);
router.get("/:id", protectCustomer, getCustomerOrder);
router.put("/:id/cancel", protectCustomer, cancelCustomerOrder);

export default router;
