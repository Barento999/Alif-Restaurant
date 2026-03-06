import express from "express";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMealsFromAPI,
  importMealFromAPI,
  getAllMealsFromAPI,
} from "../controllers/menuController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getMenuItems);
router.post("/", protect, authorize("admin", "manager"), createMenuItem);
router.put("/:id", protect, authorize("admin", "manager"), updateMenuItem);
router.delete("/:id", protect, authorize("admin", "manager"), deleteMenuItem);

// Public API route for menu display (no auth required)
router.get("/api/all", getAllMealsFromAPI);

// Protected API import routes
router.get(
  "/api/search",
  protect,
  authorize("admin", "manager"),
  searchMealsFromAPI,
);
router.post(
  "/api/import",
  protect,
  authorize("admin", "manager"),
  importMealFromAPI,
);

export default router;
