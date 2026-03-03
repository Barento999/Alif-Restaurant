import express from "express";
import {
  getInventory,
  createInventoryItem,
  updateInventoryItem,
} from "../controllers/inventoryController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getInventory);
router.post("/", protect, authorize("admin", "manager"), createInventoryItem);
router.put("/:id", protect, authorize("admin", "manager"), updateInventoryItem);

export default router;
