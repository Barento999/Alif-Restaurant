import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "reserved", "occupied"],
      default: "available",
    },
    location: String,
  },
  { timestamps: true },
);

export default mongoose.model("Table", tableSchema);
