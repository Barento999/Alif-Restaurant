import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: "",
    capacity: 2,
    location: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedTableId, setHighlightedTableId] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    // Check if there's a table ID in the URL
    const tableId = searchParams.get("table");
    if (tableId && tables.length > 0) {
      setHighlightedTableId(tableId);
      // Scroll to the table after a short delay
      setTimeout(() => {
        const element = document.getElementById(`table-${tableId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightedTableId(null);
            setSearchParams({});
          }, 3000);
        }
      }, 300);
    }
  }, [searchParams, tables]);

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
        <h1 className="text-3xl font-bold text-gray-800">Table Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0d5f4e] text-white px-4 py-2 rounded-xl hover:bg-[#0f7a62]">
          {showForm ? "Cancel" : "Add Table"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Table Number (e.g., T1)"
              value={formData.tableNumber}
              onChange={(e) =>
                setFormData({ ...formData, tableNumber: e.target.value })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: Number(e.target.value) })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
              required
            />
            <input
              type="text"
              placeholder="Location (optional)"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
            />
            <button
              type="submit"
              className="col-span-3 bg-[#0d5f4e] text-white py-3 rounded-xl hover:bg-[#0f7a62] font-medium transition">
              Add Table
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map((table) => (
          <div
            key={table._id}
            id={`table-${table._id}`}
            className={`bg-white p-5 rounded-2xl shadow-sm border overflow-hidden transition-all ${
              highlightedTableId === table._id
                ? "border-[#d4a843] border-4 ring-4 ring-[#d4a843] ring-opacity-30 animate-pulse"
                : "border-gray-100"
            }`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                {table.tableNumber}
              </h3>
              <span
                className={`${getStatusColor(table.status)} text-white px-2 py-1 rounded text-xs font-semibold`}>
                {table.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Capacity: {table.capacity} people
            </p>
            {table.location && (
              <p className="text-gray-600 text-sm mb-4">
                Location: {table.location}
              </p>
            )}
            <div className="space-y-2">
              <select
                value={table.status}
                onChange={(e) => updateStatus(table._id, e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent text-sm">
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
              </select>
              <button
                onClick={() => deleteTable(table._id)}
                className="w-full bg-white border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-50 transition text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
