import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "orders" && orders.length === 0) {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchCustomerProfile = async () => {
    try {
      const token = localStorage.getItem("customerToken");
      if (!token) {
        navigate("/customer-auth");
        return;
      }

      const response = await axios.get("/api/customers/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCustomer(response.data.data);
        setFormData({
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          phone: response.data.data.phone || "",
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("customerToken");
        localStorage.removeItem("customer");
        navigate("/customer-auth");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = localStorage.getItem("customerToken");
      const response = await axios.get("/api/customers/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("customerToken");
      const response = await axios.put(
        `/api/customers/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Order cancelled successfully" });
        fetchOrders(); // Refresh orders
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to cancel order",
      });
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      out_for_delivery: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Preparing",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return texts[status] || status;
  };

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");
    navigate("/");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("customerToken");
      const response = await axios.put("/api/customers/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCustomer(response.data.data);
        setEditMode(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    try {
      const token = localStorage.getItem("customerToken");
      const response = await axios.put(
        "/api/customers/password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to change password",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0d5f4e]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <div className="bg-[#0d5f4e] text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Account</h1>
              <p className="text-white/80 mt-1">
                Welcome back, {customer?.firstName}!
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/menu")}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors">
                Browse Menu
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                : "bg-red-50 border-l-4 border-red-500 text-red-700"
            }`}>
            {message.text}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Profile Summary */}
              <div className="text-center mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-gradient-to-br from-[#0d5f4e] to-[#d4a843] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-white">
                    {customer?.firstName?.charAt(0)}
                    {customer?.lastName?.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {customer?.firstName} {customer?.lastName}
                </h3>
                <p className="text-gray-600 text-sm">{customer?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === "profile"
                      ? "bg-[#0d5f4e] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <svg
                    className="w-5 h-5 inline mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === "orders"
                      ? "bg-[#0d5f4e] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <svg
                    className="w-5 h-5 inline mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === "addresses"
                      ? "bg-[#0d5f4e] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <svg
                    className="w-5 h-5 inline mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === "security"
                      ? "bg-[#0d5f4e] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                  <svg
                    className="w-5 h-5 inline mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Security
                </button>
              </nav>

              {/* Loyalty Points */}
              <div className="mt-6 pt-6 border-t">
                <div className="bg-gradient-to-br from-[#0d5f4e] to-[#d4a843] rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">
                      Loyalty Points
                    </span>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-black">
                    {customer?.loyaltyPoints || 0}
                  </div>
                  <div className="text-xs text-white/80 mt-1">
                    Total Orders: {customer?.totalOrders || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Profile Information
                    </h2>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-6 py-2 bg-[#0d5f4e] text-white rounded-lg font-semibold hover:bg-[#0f7a62] transition-colors">
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {editMode ? (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                firstName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lastName: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email (cannot be changed)
                        </label>
                        <input
                          type="email"
                          value={customer?.email}
                          disabled
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-[#0d5f4e] text-white rounded-lg font-semibold hover:bg-[#0f7a62] transition-colors">
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditMode(false);
                            setFormData({
                              firstName: customer?.firstName,
                              lastName: customer?.lastName,
                              phone: customer?.phone || "",
                            });
                          }}
                          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-1">
                            First Name
                          </label>
                          <p className="text-lg text-gray-800">
                            {customer?.firstName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-500 mb-1">
                            Last Name
                          </label>
                          <p className="text-lg text-gray-800">
                            {customer?.lastName}
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">
                          Email
                        </label>
                        <p className="text-lg text-gray-800">
                          {customer?.email}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">
                          Phone Number
                        </label>
                        <p className="text-lg text-gray-800">
                          {customer?.phone || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">
                          Member Since
                        </label>
                        <p className="text-lg text-gray-800">
                          {new Date(customer?.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    My Orders
                  </h2>
                  {ordersLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0d5f4e] mx-auto"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#0d5f4e] transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">
                                Order #{order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  },
                                )}
                              </p>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>

                          <div className="border-t border-gray-200 pt-4 mb-4">
                            <h4 className="font-semibold text-gray-800 mb-3">
                              Items:
                            </h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm">
                                  <span className="text-gray-700">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="font-semibold text-gray-800">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-4 mb-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Subtotal:</span>
                              <span className="text-gray-800">
                                ${order.subtotal.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">
                                Delivery Fee:
                              </span>
                              <span className="text-gray-800">
                                ${order.deliveryFee.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-600">Tax:</span>
                              <span className="text-gray-800">
                                ${order.tax.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                              <span className="text-gray-800">Total:</span>
                              <span className="text-[#0d5f4e]">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-semibold">
                                Delivery Address:
                              </span>{" "}
                              {order.deliveryAddress.street},{" "}
                              {order.deliveryAddress.city},{" "}
                              {order.deliveryAddress.state}{" "}
                              {order.deliveryAddress.zipCode}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Phone:</span>{" "}
                              {order.contactPhone}
                            </p>
                            {order.notes && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-semibold">Notes:</span>{" "}
                                {order.notes}
                              </p>
                            )}
                          </div>

                          {["pending", "confirmed"].includes(order.status) && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg
                        className="w-24 h-24 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        No orders yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start ordering from our delicious menu!
                      </p>
                      <button
                        onClick={() => navigate("/menu")}
                        className="px-8 py-3 bg-[#0d5f4e] text-white rounded-lg font-semibold hover:bg-[#0f7a62] transition-colors">
                        Browse Menu
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Delivery Addresses
                    </h2>
                    <button className="px-6 py-2 bg-[#0d5f4e] text-white rounded-lg font-semibold hover:bg-[#0f7a62] transition-colors">
                      Add Address
                    </button>
                  </div>
                  {customer?.addresses?.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {customer.addresses.map((address, index) => (
                        <div
                          key={index}
                          className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#0d5f4e] transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <span className="px-3 py-1 bg-[#0d5f4e] text-white text-sm font-semibold rounded-full">
                              {address.label}
                            </span>
                            {address.isDefault && (
                              <span className="px-3 py-1 bg-[#d4a843] text-white text-sm font-semibold rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-gray-800">{address.street}</p>
                          <p className="text-gray-600">
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg
                        className="w-24 h-24 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        No addresses saved
                      </h3>
                      <p className="text-gray-600">
                        Add a delivery address to get started
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Change Password
                  </h2>
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#0d5f4e] text-white rounded-lg font-semibold hover:bg-[#0f7a62] transition-colors">
                      Change Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
