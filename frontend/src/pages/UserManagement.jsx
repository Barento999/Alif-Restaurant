import { useState, useEffect } from "react";
import api from "../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "waiter",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data.data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      setShowForm(false);
      setFormData({ name: "", email: "", password: "", role: "waiter" });
      loadUsers();
      alert("User created successfully");
    } catch (error) {
      alert("Error creating user: " + error.response?.data?.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.put(`/users/${id}`, { isActive: !currentStatus });
      loadUsers();
    } catch (error) {
      alert("Error updating user status");
    }
  };

  const handleDelete = async (id, userName) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${userName}"? This action cannot be undone.`,
      )
    ) {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
        alert("User deleted successfully");
      } catch (error) {
        alert(
          "Error deleting user: " +
            (error.response?.data?.message || "Unknown error"),
        );
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0d5f4e] text-white px-6 py-2.5 rounded-xl hover:bg-[#0f7a62] font-medium transition">
          {showForm ? "Cancel" : "Add User"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent"
              required
            />
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent">
              <option value="waiter">Waiter</option>
              <option value="cashier">Cashier</option>
              <option value="kitchen">Kitchen Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="col-span-2 bg-[#0d5f4e] text-white py-3 rounded-xl hover:bg-[#0f7a62] font-medium transition">
              Create User
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-800 font-medium">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-[#0d5f4e] bg-opacity-10 text-[#0d5f4e] rounded-full text-xs font-semibold">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(user._id, user.isActive)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${user.isActive ? "bg-white border border-orange-200 text-orange-600 hover:bg-orange-50" : "bg-white border border-green-200 text-green-600 hover:bg-green-50"}`}>
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(user._id, user.name)}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-red-200 text-red-600 hover:bg-red-50 transition">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
