import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["cash", "card", "mobile"],
      required: true,
    },
    transactionId: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

paymentSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model("Payment", paymentSchema);
