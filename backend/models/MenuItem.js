import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    description: String,
    image: String,
    isAvailable: { type: Boolean, default: true },
    ingredients: [String],
  },
  { timestamps: true },
);

menuItemSchema.index({ name: 1, category: 1 });

export default mongoose.model("MenuItem", menuItemSchema);
