import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, getOrders);
router.patch("/:id/status", protect, updateOrderStatus);

export default router;
