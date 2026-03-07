import mongoose from "mongoose";
import dotenv from "dotenv";
import Promo from "../models/Promo.js";
import connectDB from "../config/db.js";

dotenv.config();

const promos = [
  {
    code: "WELCOME20",
    title: "20% OFF First Order",
    description: "New customers get 20% off their first online order",
    type: "percentage",
    value: 20,
    minOrderAmount: 0,
    maxDiscount: 50,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2026-12-31"),
    usageLimit: null,
    isActive: true,
    applicableFor: "first_order",
  },
  {
    code: "FREEDEL30",
    title: "FREE DELIVERY",
    description: "Free delivery on orders over $30",
    type: "free_delivery",
    value: 0,
    minOrderAmount: 30,
    maxDiscount: null,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2026-12-31"),
    usageLimit: null,
    isActive: true,
    applicableFor: "all",
  },
];

const seedPromos = async () => {
  try {
    await connectDB();

    await Promo.deleteMany({});
    console.log("Existing promos deleted");

    await Promo.insertMany(promos);
    console.log("Promos seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding promos:", error);
    process.exit(1);
  }
};

seedPromos();
