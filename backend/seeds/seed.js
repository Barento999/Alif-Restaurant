import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import Table from "../models/Table.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();

    console.log("🗑️  Cleared existing data");

    // Fetch meals from TheMealDB API
    console.log("🌐 Fetching meals from TheMealDB API...");

    // Use multiple strategies to get more meals
    const allMeals = new Map(); // Use Map to automatically handle duplicates by ID
    const categoryMap = new Map();

    // Strategy 1: Search by first letter (a-z)
    console.log("📝 Fetching meals by first letter...");
    const letters = "abcdefghijklmnopqrstuvwxyz".split("");

    for (const letter of letters) {
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`,
        );
        const data = await response.json();

        if (data.meals) {
          data.meals.forEach((meal) => {
            if (!allMeals.has(meal.idMeal)) {
              // Extract ingredients
              const ingredients = [];
              for (let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                if (ingredient && ingredient.trim()) {
                  ingredients.push(ingredient);
                }
              }

              allMeals.set(meal.idMeal, {
                id: meal.idMeal,
                name: meal.strMeal,
                category: meal.strCategory,
                area: meal.strArea,
                description: meal.strInstructions,
                image: meal.strMealThumb,
                ingredients: ingredients,
              });

              // Track unique categories
              if (!categoryMap.has(meal.strCategory)) {
                categoryMap.set(meal.strCategory, {
                  name: meal.strCategory,
                  description: `${meal.strCategory} dishes`,
                });
              }
            }
          });
        }

        console.log(
          `   Letter '${letter}': ${allMeals.size} total unique meals so far`,
        );

        // Stop if we have 300 or more meals
        if (allMeals.size >= 300) {
          console.log("✅ Reached 300 meals, stopping fetch...");
          break;
        }
      } catch (error) {
        console.error(`Error fetching letter ${letter}:`, error.message);
      }
    }

    // Convert Map to Array and limit to 300
    const uniqueMeals = Array.from(allMeals.values()).slice(0, 300);

    console.log(`\n📦 Total unique meals fetched: ${uniqueMeals.length}`);

    // Create categories in database
    const categories = await Category.create(Array.from(categoryMap.values()));
    console.log(`✅ Created ${categories.length} categories`);

    // Create category lookup map
    const categoryLookup = {};
    categories.forEach((cat) => {
      categoryLookup[cat.name] = cat._id;
    });

    // Generate price based on category
    const generatePrice = (categoryName) => {
      const priceRanges = {
        Dessert: [5, 10],
        Starter: [6, 12],
        Side: [4, 8],
        Breakfast: [7, 15],
        Vegetarian: [10, 18],
        Vegan: [10, 18],
        Seafood: [18, 35],
        Beef: [15, 30],
        Chicken: [12, 25],
        Lamb: [16, 32],
        Pork: [14, 28],
        Pasta: [12, 22],
        Miscellaneous: [8, 20],
      };

      const range = priceRanges[categoryName] || [10, 20];
      return (Math.random() * (range[1] - range[0]) + range[0]).toFixed(2);
    };

    // Create menu items
    const menuItems = uniqueMeals.map((meal) => ({
      name: meal.name,
      category: categoryLookup[meal.category],
      price: parseFloat(generatePrice(meal.category)),
      description: meal.description?.substring(0, 300),
      image: meal.image,
      ingredients: meal.ingredients,
      isAvailable: true,
    }));

    await MenuItem.create(menuItems);
    console.log(`✅ Created ${menuItems.length} menu items`);

    // Create tables
    await Table.create([
      { tableNumber: "T1", capacity: 4, status: "available" },
      { tableNumber: "T2", capacity: 2, status: "available" },
      { tableNumber: "T3", capacity: 6, status: "available" },
      { tableNumber: "T4", capacity: 4, status: "available" },
      { tableNumber: "T5", capacity: 8, status: "available" },
    ]);

    console.log("✅ Created 5 tables");

    console.log("\n🎉 Seed completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Menu Items: ${menuItems.length}`);
    console.log(`   - Tables: 5`);
    console.log(
      "\n⚠️  Note: No users created. Please register users through the application.",
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
