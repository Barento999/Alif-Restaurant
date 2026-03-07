import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed", "free_delivery"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
    maxDiscount: {
      type: Number,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableFor: {
      type: String,
      enum: ["all", "first_order", "returning"],
      default: "all",
    },
  },
  {
    timestamps: true,
  },
);

// Method to check if promo is valid
promoSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (this.usageLimit === null || this.usageCount < this.usageLimit)
  );
};

// Method to calculate discount
promoSchema.methods.calculateDiscount = function (orderAmount) {
  if (!this.isValid() || orderAmount < this.minOrderAmount) {
    return 0;
  }

  let discount = 0;

  switch (this.type) {
    case "percentage":
      discount = (orderAmount * this.value) / 100;
      if (this.maxDiscount && discount > this.maxDiscount) {
        discount = this.maxDiscount;
      }
      break;
    case "fixed":
      discount = this.value;
      break;
    case "free_delivery":
      discount = 0; // Handled separately in order
      break;
  }

  return Math.min(discount, orderAmount);
};

export default mongoose.model("Promo", promoSchema);
