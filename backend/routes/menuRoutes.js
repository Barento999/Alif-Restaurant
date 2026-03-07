import express from "express";
import {
  getMenuItems,
  getPublicMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  searchMealsFromAPI,
  importMealFromAPI,
  getAllMealsFromAPI,
} from "../controllers/menuController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Public route - get menu for customers (no auth required)
router.get("/public", getPublicMenu);

// Protected routes for staff
router.get("/", protect, getMenuItems);
router.post("/", protect, authorize("admin", "manager"), createMenuItem);
router.put("/:id", protect, authorize("admin", "manager"), updateMenuItem);
router.delete("/:id", protect, authorize("admin", "manager"), deleteMenuItem);

// API routes for importing from TheMealDB (for admin/manager to populate menu)
router.get("/api/all", getAllMealsFromAPI);
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
