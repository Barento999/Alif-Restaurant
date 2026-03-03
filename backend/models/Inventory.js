import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true },
    lowStockThreshold: { type: Number, default: 10 },
    category: String,
  },
  { timestamps: true },
);

export default mongoose.model("Inventory", inventorySchema);
