import { useState, useEffect } from "react";
import api from "../services/api";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: 0,
    unit: "",
    lowStockThreshold: 10,
    category: "",
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const { data } = await api.get("/inventory");
      setItems(data.data);
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/inventory", formData);
      setShowForm(false);
      setFormData({
        name: "",
        quantity: 0,
        unit: "",
        lowStockThreshold: 10,
        category: "",
      });
      loadInventory();
    } catch (error) {
      alert("Error creating item: " + error.response?.data?.message);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      await api.put(`/inventory/${id}`, { quantity: newQuantity });
      loadInventory();
    } catch (error) {
      alert("Error updating quantity");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Inventory Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0d5f4e] text-white px-4 py-2 rounded-xl hover:bg-[#0f7a62]">
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Unit (kg, liter, pieces)"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
              required
            />
            <input
              type="number"
              placeholder="Low Stock Alert"
              value={formData.lowStockThreshold}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lowStockThreshold: Number(e.target.value),
                })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
            />
            <button
              type="submit"
              className="col-span-2 bg-[#0d5f4e] text-white py-3 rounded-xl hover:bg-[#0f7a62] font-medium transition">
              Add Item
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {item.name}
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                Quantity:{" "}
                <span
                  className={
                    item.quantity <= item.lowStockThreshold
                      ? "text-red-600 font-bold"
                      : "text-[#0d5f4e] font-semibold"
                  }>
                  {item.quantity} {item.unit}
                </span>
              </p>
              {item.quantity <= item.lowStockThreshold && (
                <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 px-3 py-2 rounded-lg">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Low Stock Alert!
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 10)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:border-[#0d5f4e] hover:bg-gray-50 transition">
                  +10
                </button>
                <button
                  onClick={() =>
                    updateQuantity(item._id, Math.max(0, item.quantity - 10))
                  }
                  className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                  -10
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
