import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
