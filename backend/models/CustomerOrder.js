import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: String,
});

const customerOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [orderItemSchema],
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    contactPhone: {
      type: String,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 5.0,
    },
    tax: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    promoCode: {
      type: String,
      default: null,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    notes: String,
    estimatedDeliveryTime: Date,
  },
  {
    timestamps: true,
  },
);

// Generate order number before saving
customerOrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model("CustomerOrder").countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

// Indexes for efficient queries
customerOrderSchema.index({ orderNumber: 1 }, { unique: true });
customerOrderSchema.index({ customer: 1, createdAt: -1 });
customerOrderSchema.index({ status: 1 });

export default mongoose.model("CustomerOrder", customerOrderSchema);
