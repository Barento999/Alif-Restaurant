import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import Table from "../models/Table.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await User.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();

    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@rms.com",
        password: "admin123",
        role: "admin",
      },
      {
        name: "Manager",
        email: "manager@rms.com",
        password: "manager123",
        role: "manager",
      },
      {
        name: "Sarah Cashier",
        email: "cashier@rms.com",
        password: "cashier123",
        role: "cashier",
      },
      {
        name: "John Waiter",
        email: "waiter@rms.com",
        password: "waiter123",
        role: "waiter",
      },
      {
        name: "Kitchen Staff",
        email: "kitchen@rms.com",
        password: "kitchen123",
        role: "kitchen",
      },
    ]);

    const categories = await Category.create([
      { name: "Appetizers", description: "Starters and small bites" },
      { name: "Main Course", description: "Main dishes" },
      { name: "Desserts", description: "Sweet treats" },
      { name: "Beverages", description: "Drinks" },
    ]);

    await MenuItem.create([
      {
        name: "Caesar Salad",
        category: categories[0]._id,
        price: 8.99,
        isAvailable: true,
      },
      {
        name: "Grilled Chicken",
        category: categories[1]._id,
        price: 15.99,
        isAvailable: true,
      },
      {
        name: "Chocolate Cake",
        category: categories[2]._id,
        price: 6.99,
        isAvailable: true,
      },
      {
        name: "Fresh Juice",
        category: categories[3]._id,
        price: 4.99,
        isAvailable: true,
      },
    ]);

    await Table.create([
      { tableNumber: "T1", capacity: 4, status: "available" },
      { tableNumber: "T2", capacity: 2, status: "available" },
      { tableNumber: "T3", capacity: 6, status: "available" },
    ]);

    console.log("Seed data created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
