import { useState, useEffect } from "react";
import api from "../services/api";

export default function MenuManagement() {
  const [apiMeals, setApiMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadAllMealsFromAPI();
  }, []);

  const loadAllMealsFromAPI = async () => {
    setLoading(true);
    try {
      // Fetch all meals from our backend (which caches TheMealDB data)
      const response = await api.get("/menu/api/all");

      if (response.data.success) {
        const meals = response.data.data || [];
        const apiCategories = response.data.categories || [];

        // Add prices to meals
        const mealsWithPrices = meals.map((meal) => ({
          ...meal,
          price: generatePrice(meal.category),
        }));

        setApiMeals(mealsWithPrices);
        setCategories(["All", ...apiCategories]);
      }
    } catch (error) {
      console.error("Error loading meals:", error);
      alert("Error loading meals from API. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate price based on category
  const generatePrice = (category) => {
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

    const range = priceRanges[category] || [10, 20];
    return (Math.random() * (range[1] - range[0]) + range[0]).toFixed(2);
  };

  const filteredMeals =
    selectedCategory === "All"
      ? apiMeals
      : apiMeals.filter((meal) => meal.category === selectedCategory);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Menu Management
        </h1>
        <p className="text-gray-600">
          Browse {apiMeals.length} meals from TheMealDB API
        </p>
      </div>

      {/* Category Filter */}
      {!loading && categories.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-700">
              Filter by Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedCategory === cat
                    ? "bg-[#0d5f4e] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                {cat}
                {cat !== "All" &&
                  ` (${apiMeals.filter((m) => m.category === cat).length})`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0d5f4e] mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Loading Meals from API...
          </h3>
          <p className="text-gray-500">
            Fetching delicious meals from TheMealDB
          </p>
        </div>
      )}

      {/* Meals Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredMeals.length === 0 && (
        <div className="text-center py-16">
          <svg
            className="w-20 h-20 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-600 mb-2">
            No meals found in this category
          </h3>
        </div>
      )}
    </div>
  );
}

// Meal Card Component
function MealCard({ meal }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Image */}
      <div className="relative h-56 overflow-hidden group">
        <img
          src={meal.image}
          alt={meal.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-[#0d5f4e] text-white rounded-full text-xs font-semibold shadow-lg">
            {meal.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-white bg-opacity-90 text-gray-700 rounded-full text-xs font-medium shadow">
            {meal.area}
          </span>
        </div>
      </div>

      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{meal.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-[#0d5f4e] text-3xl font-bold">${meal.price}</p>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              Available
            </span>
          </div>
        </div>

        {/* Description */}
        {meal.description && (
          <div className="mb-4">
            <p
              className={`text-gray-600 text-sm leading-relaxed ${!showDetails ? "line-clamp-3" : ""}`}>
              {meal.description}
            </p>
            {meal.description.length > 150 && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-[#0d5f4e] text-xs font-semibold mt-2 hover:underline flex items-center gap-1">
                {showDetails ? (
                  <>
                    Show less
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    Read more
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Ingredients */}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#0d5f4e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Ingredients ({meal.ingredients.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {meal.ingredients
                .slice(0, showDetails ? undefined : 8)
                .map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                    {ing}
                  </span>
                ))}
              {!showDetails && meal.ingredients.length > 8 && (
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-2.5 py-1 bg-[#0d5f4e] bg-opacity-10 text-[#0d5f4e] text-xs rounded-full font-semibold hover:bg-opacity-20">
                  +{meal.ingredients.length - 8} more
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {meal.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#d4a843] bg-opacity-10 text-[#d4a843] text-xs rounded font-medium">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-[#0d5f4e] to-[#0f7a62] text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View Details
        </button>
      </div>
    </div>
  );
}
