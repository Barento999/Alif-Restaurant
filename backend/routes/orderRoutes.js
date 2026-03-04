import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/status", protect, updateOrderStatus);
router.delete("/:id", protect, authorize("admin", "manager"), deleteOrder);

export default router;
