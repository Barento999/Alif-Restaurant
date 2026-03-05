import express from "express";
import {
  login,
  register,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", protect, authorize("admin", "manager"), register);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;
