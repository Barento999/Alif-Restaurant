import express from "express";
import {
  getDailyReport,
  getMonthlyReport,
  getBestSellers,
} from "../controllers/reportController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/daily", protect, authorize("admin", "manager"), getDailyReport);
router.get(
  "/monthly",
  protect,
  authorize("admin", "manager"),
  getMonthlyReport,
);
router.get(
  "/best-sellers",
  protect,
  authorize("admin", "manager"),
  getBestSellers,
);

export default router;
