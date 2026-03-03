import express from "express";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getMenuItems);
router.post("/", protect, authorize("admin", "manager"), createMenuItem);
router.put("/:id", protect, authorize("admin", "manager"), updateMenuItem);
router.delete("/:id", protect, authorize("admin", "manager"), deleteMenuItem);

export default router;
