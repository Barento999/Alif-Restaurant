import express from "express";
import {
  createCustomerOrder,
  getCustomerOrders,
  getCustomerOrder,
  cancelCustomerOrder,
} from "../controllers/customerOrderController.js";
import { protectCustomer } from "../middlewares/customerAuth.js";

const router = express.Router();

// All routes are protected (customer must be logged in)
router.post("/", protectCustomer, createCustomerOrder);
router.get("/", protectCustomer, getCustomerOrders);
router.get("/:id", protectCustomer, getCustomerOrder);
router.put("/:id/cancel", protectCustomer, cancelCustomerOrder);

export default router;
