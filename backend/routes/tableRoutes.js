import express from "express";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
} from "../controllers/tableController.js";
import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, getTables);
router.post("/", protect, authorize("admin", "manager"), createTable);
router.put("/:id", protect, authorize("admin", "manager"), updateTable);
router.delete("/:id", protect, authorize("admin", "manager"), deleteTable);

export default router;
