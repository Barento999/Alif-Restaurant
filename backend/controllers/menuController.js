import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";

export const getMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const items = await MenuItem.find(filter).populate("category");
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.json({ success: true, message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search meals from TheMealDB API
export const searchMealsFromAPI = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Search query required" });
    }

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`,
    );
    const data = await response.json();

    if (!data.meals) {
      return res.json({ success: true, data: [] });
    }

    // Format meals for our system
    const meals = data.meals.map((meal) => ({
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      description: meal.strInstructions?.substring(0, 200) + "...",
      image: meal.strMealThumb,
      area: meal.strArea,
    }));

    res.json({ success: true, data: meals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Import meal from TheMealDB API
export const importMealFromAPI = async (req, res) => {
  try {
    const { mealId, categoryId, price } = req.body;

    if (!mealId || !categoryId || !price) {
      return res.status(400).json({
        success: false,
        message: "Meal ID, category, and price required",
      });
    }

    // Fetch meal details from API
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
    );
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Meal not found" });
    }

    const meal = data.meals[0];

    // Extract ingredients
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(ingredient);
      }
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Create menu item
    const menuItem = await MenuItem.create({
      name: meal.strMeal,
      category: categoryId,
      price: Number(price),
      description: meal.strInstructions?.substring(0, 300),
      image: meal.strMealThumb,
      ingredients: ingredients,
      isAvailable: true,
    });

    const populatedItem = await MenuItem.findById(menuItem._id).populate(
      "category",
    );

    res.status(201).json({ success: true, data: populatedItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
