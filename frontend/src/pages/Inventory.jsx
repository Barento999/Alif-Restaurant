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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Inventory Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: Number(e.target.value) })
              }
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Unit (kg, liter, pieces)"
              value={formData.unit}
              onChange={(e) =>
                setFormData({ ...formData, unit: e.target.value })
              }
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
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
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="col-span-2 bg-green-600 text-white p-2 rounded hover:bg-green-700">
              Add Item
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              {item.name}
            </h3>
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-300">
                Quantity:{" "}
                <span
                  className={
                    item.quantity <= item.lowStockThreshold
                      ? "text-red-600 font-bold"
                      : "text-green-600"
                  }>
                  {item.quantity} {item.unit}
                </span>
              </p>
              {item.quantity <= item.lowStockThreshold && (
                <p className="text-red-600 font-semibold">
                  ⚠️ Low Stock Alert!
                </p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 10)}
                  className="flex-1 bg-green-600 text-white p-2 rounded text-sm">
                  +10
                </button>
                <button
                  onClick={() =>
                    updateQuantity(item._id, Math.max(0, item.quantity - 10))
                  }
                  className="flex-1 bg-red-600 text-white p-2 rounded text-sm">
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
