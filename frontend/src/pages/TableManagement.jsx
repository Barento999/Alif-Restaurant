import { useState, useEffect } from "react";
import api from "../services/api";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: 2,
    location: "",
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const { data } = await api.get("/tables");
      setTables(data.data);
    } catch (error) {
      console.error("Error loading tables:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tables", formData);
      setShowForm(false);
      setFormData({ tableNumber: "", capacity: 2, location: "" });
      loadTables();
    } catch (error) {
      alert("Error creating table: " + error.response?.data?.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tables/${id}`, { status });
      loadTables();
    } catch (error) {
      alert("Error updating status");
    }
  };

  const deleteTable = async (id) => {
    if (!confirm("Delete this table?")) return;
    try {
      await api.delete(`/tables/${id}`);
      loadTables();
    } catch (error) {
      alert("Error deleting table");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "occupied":
        return "bg-red-500";
      case "reserved":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Table Management
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {showForm ? "Cancel" : "Add Table"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Table Number (e.g., T1)"
              value={formData.tableNumber}
              onChange={(e) =>
                setFormData({ ...formData, tableNumber: e.target.value })
              }
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: Number(e.target.value) })
              }
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Location (optional)"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              className="col-span-3 bg-green-600 text-white p-2 rounded hover:bg-green-700">
              Add Table
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div
            key={table._id}
            className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                {table.tableNumber}
              </h3>
              <span
                className={`${getStatusColor(table.status)} text-white px-3 py-1 rounded text-sm`}>
                {table.status}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Capacity: {table.capacity} people
            </p>
            {table.location && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Location: {table.location}
              </p>
            )}
            <div className="space-y-2">
              <select
                value={table.status}
                onChange={(e) => updateStatus(table._id, e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white">
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
              <button
                onClick={() => deleteTable(table._id)}
                className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
