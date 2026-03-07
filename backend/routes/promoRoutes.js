import express from "express";
const router = express.Router();
import promoController from "../controllers/promoController.js";
import { protect } from "../middlewares/auth.js";
import { protectCustomer } from "../middlewares/customerAuth.js";

// Public routes
router.get("/active", promoController.getActivePromos);

// Customer routes
router.post("/validate", protectCustomer, promoController.validatePromo);

// Admin routes
router.get("/", protect, promoController.getAllPromos);
router.post("/", protect, promoController.createPromo);
router.put("/:id", protect, promoController.updatePromo);
router.delete("/:id", protect, promoController.deletePromo);

export default router;
