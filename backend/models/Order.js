import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    waiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "paid", "cancelled"],
      default: "pending",
    },
    // Status timestamps for tracking workflow
    statusTimestamps: {
      pending: { type: Date },
      preparing: { type: Date },
      ready: { type: Date },
      served: { type: Date },
      paid: { type: Date },
      cancelled: { type: Date },
    },
    notes: String,
  },
  { timestamps: true },
);

// Middleware to set status timestamp when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    // Set timestamp for the new status
    if (!this.statusTimestamps) {
      this.statusTimestamps = {};
    }
    this.statusTimestamps[this.status] = new Date();
  }
  next();
});

orderSchema.index({ orderNumber: 1, status: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
