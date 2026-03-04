import { useState, useEffect } from "react";
import api from "../services/api";

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    isAvailable: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        api.get("/menu"),
        api.get("/categories"),
      ]);
      setItems(menuRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, formData);
      } else {
        await api.post("/menu", formData);
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({
        name: "",
        category: "",
        price: 0,
        description: "",
        isAvailable: true,
      });
      loadData();
    } catch (error) {
      alert("Error saving item: " + error.response?.data?.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category._id,
      price: item.price,
      description: item.description || "",
      isAvailable: item.isAvailable,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/menu/${id}`);
      loadData();
    } catch (error) {
      alert("Error deleting item");
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingItem(null);
            setFormData({
              name: "",
              category: "",
              price: 0,
              description: "",
              isAvailable: true,
            });
          }}
          className="bg-[#0d5f4e] text-white px-4 py-2 rounded-xl hover:bg-[#0f7a62]">
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {editingItem ? "Edit Item" : "Add New Item"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Item Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="p-2 border rounded-lg focus:ring-2 focus:ring-[#0d5f4e]"
              required
            />
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="p-2 border rounded-lg focus:ring-2 focus:ring-[#0d5f4e]"
              required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
              className="p-2 border rounded-lg focus:ring-2 focus:ring-[#0d5f4e]"
              required
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
                className="mr-2"
              />
              <label className="text-gray-800">Available</label>
            </div>
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="col-span-2 p-2 border rounded-lg focus:ring-2 focus:ring-[#0d5f4e]"
              rows="3"
            />
            <button
              type="submit"
              className="col-span-2 bg-[#0d5f4e] text-white p-2 rounded-xl hover:bg-[#0f7a62]">
              {editingItem ? "Update Item" : "Add Item"}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
              <span
                className={`px-2 py-1 rounded-lg text-sm ${item.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {item.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            <p className="text-[#d4a843] text-2xl font-bold mb-2">
              ${item.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-2">{item.category?.name}</p>
            {item.description && (
              <p className="text-gray-500 text-sm mb-4">{item.description}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 bg-[#0d5f4e] text-white p-2 rounded-lg hover:bg-[#0f7a62]">
                Edit
              </button>
              <button
                onClick={() => toggleAvailability(item)}
                className="flex-1 bg-[#d4a843] text-white p-2 rounded-lg hover:bg-[#c09838]">
                Toggle
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
