import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedItemId, setHighlightedItemId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Check if there's an item ID in the URL
    const itemId = searchParams.get("item");
    if (itemId && items.length > 0) {
      setHighlightedItemId(itemId);
      // Scroll to the item after a short delay to ensure it's rendered
      setTimeout(() => {
        const element = document.getElementById(`item-${itemId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightedItemId(null);
            setSearchParams({});
          }, 3000);
        }
      }, 300);
    }
  }, [searchParams, items]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        api.get("/menu"),
        api.get("/categories"),
      ]);
      setItems(menuRes.data.data);
      setAllCategories(catRes.data.data);
      setCategories(["All", ...catRes.data.data.map((c) => c.name)]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await api.put(`/menu/${item._id}`, { isAvailable: !item.isAvailable });
      loadData();
    } catch (error) {
      alert("Error updating availability");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await api.put(`/menu/${editingItem._id}`, updatedData);
      setShowEditModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      alert("Error updating item: " + error.response?.data?.message);
    }
  };

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category?.name === selectedCategory);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Menu Management
        </h1>
        <p className="text-gray-600">
          Manage {items.length} menu items from your database
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
                  ` (${items.filter((m) => m.category?.name === cat).length})`}
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
            Loading Menu...
          </h3>
        </div>
      )}

      {/* Meals Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <MealCard
              key={item._id}
              item={item}
              onToggle={toggleAvailability}
              onEdit={handleEdit}
              isHighlighted={highlightedItemId === item._id}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <EditModal
          item={editingItem}
          categories={allCategories}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Empty State */}
      {!loading && filteredItems.length === 0 && (
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
            No items found in this category
          </h3>
        </div>
      )}
    </div>
  );
}

// Meal Card Component
function MealCard({ item, onToggle, onEdit, isHighlighted }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div
      id={`item-${item._id}`}
      className={`bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 ${
        isHighlighted
          ? "border-[#d4a843] border-4 ring-4 ring-[#d4a843] ring-opacity-30 animate-pulse"
          : "border-gray-100"
      }`}>
      {/* Image */}
      {item.image && (
        <div className="relative h-56 overflow-hidden group">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                item.isAvailable
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}>
              {item.isAvailable ? "Available" : "Unavailable"}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="px-3 py-1 bg-[#0d5f4e] text-white rounded-full text-xs font-semibold shadow">
              {item.category?.name}
            </span>
          </div>
          {/* Edit Button Overlay */}
          <button
            onClick={() => onEdit(item)}
            className="absolute top-3 left-3 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition">
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
          <div className="flex items-center justify-between">
            <p className="text-[#0d5f4e] text-3xl font-bold">
              ${item.price.toFixed(2)}
            </p>
            {!item.image && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                {item.isAvailable ? "Available" : "Unavailable"}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div className="mb-4">
            <p
              className={`text-gray-600 text-sm leading-relaxed ${!showDetails ? "line-clamp-3" : ""}`}>
              {item.description}
            </p>
            {item.description.length > 150 && (
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
        {item.ingredients && item.ingredients.length > 0 && (
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
              Ingredients ({item.ingredients.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {item.ingredients
                .slice(0, showDetails ? undefined : 8)
                .map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                    {ing}
                  </span>
                ))}
              {!showDetails && item.ingredients.length > 8 && (
                <button
                  onClick={() => setShowDetails(true)}
                  className="px-2.5 py-1 bg-[#0d5f4e] bg-opacity-10 text-[#0d5f4e] text-xs rounded-full font-semibold hover:bg-opacity-20">
                  +{item.ingredients.length - 8} more
                </button>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onToggle(item)}
          className={`w-full py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center gap-2 ${
            item.isAvailable
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg"
              : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg"
          }`}>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          {item.isAvailable ? "Mark Unavailable" : "Mark Available"}
        </button>
      </div>
    </div>
  );
}

// Edit Modal Component
function EditModal({ item, categories, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: item.name,
    price: item.price,
    category: item.category?._id || "",
    description: item.description || "",
    isAvailable: item.isAvailable,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Menu Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Image Preview */}
          {item.image && (
            <div className="mb-6">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
                required
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
                  required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
                rows="4"
              />
            </div>

            {/* Availability */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
                className="w-5 h-5 text-[#0d5f4e] rounded focus:ring-[#0d5f4e]"
              />
              <label className="ml-3 text-sm font-semibold text-gray-700">
                Available for ordering
              </label>
            </div>

            {/* Ingredients (Read-only) */}
            {item.ingredients && item.ingredients.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ingredients (from API - read only)
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  {item.ingredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-[#0d5f4e] text-white py-3 rounded-xl font-semibold hover:bg-[#0f7a62] transition">
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
