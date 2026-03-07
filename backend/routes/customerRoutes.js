import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  changeCustomerPassword,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
} from "../controllers/customerAuthController.js";
import { protectCustomer } from "../middlewares/customerAuth.js";

const router = express.Router();

// Public routes
router.post("/register", registerCustomer);
router.post("/login", loginCustomer);

// Protected routes
router.get("/profile", protectCustomer, getCustomerProfile);
router.put("/profile", protectCustomer, updateCustomerProfile);
router.put("/password", protectCustomer, changeCustomerPassword);

// Address management
router.post("/addresses", protectCustomer, addCustomerAddress);
router.put("/addresses/:addressId", protectCustomer, updateCustomerAddress);
router.delete("/addresses/:addressId", protectCustomer, deleteCustomerAddress);

export default router;
