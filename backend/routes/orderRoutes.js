import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  cancelOrder,
  modifyOrder,
  updateOrderNotes,
} from "../controllers/orderController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/status", protect, updateOrderStatus);
router.patch("/:id/notes", protect, updateOrderNotes);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:id/modify", protect, modifyOrder);
router.delete("/:id", protect, authorize("admin"), deleteOrder);

export default router;
