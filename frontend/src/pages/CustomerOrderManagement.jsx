import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function CustomerOrderManagement() {
  const { token, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/customer-orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `/api/customer-orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert(error.response?.data?.message || "Failed to update order");
    }
  };

  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will permanently delete this order from the database.\n\n" +
        "This action CANNOT be undone!\n\n" +
        "Are you absolutely sure you want to delete this order?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(`/api/customer-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        alert("✓ Order deleted successfully");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert(error.response?.data?.message || "Failed to delete order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      preparing: "bg-purple-100 text-purple-800 border-purple-300",
      out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-300",
      delivered: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
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

  const filteredOrders = orders
    .filter((order) => {
      if (filter === "all") return true;
      return order.status === filter;
    })
    .filter((order) => {
      if (!searchTerm) return true;
      return (
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customer?.firstName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        order.customer?.lastName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Customer Orders
        </h1>
        <p className="text-gray-600">Manage online orders from customers</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              placeholder="Search by order number, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none">
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="text-yellow-600 text-sm font-semibold mb-1">
            Pending
          </div>
          <div className="text-2xl font-bold text-yellow-800">
            {orders.filter((o) => o.status === "pending").length}
          </div>
        </div>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-semibold mb-1">
            Confirmed
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {orders.filter((o) => o.status === "confirmed").length}
          </div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="text-purple-600 text-sm font-semibold mb-1">
            Preparing
          </div>
          <div className="text-2xl font-bold text-purple-800">
            {orders.filter((o) => o.status === "preparing").length}
          </div>
        </div>
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
          <div className="text-indigo-600 text-sm font-semibold mb-1">
            Out for Delivery
          </div>
          <div className="text-2xl font-bold text-indigo-800">
            {orders.filter((o) => o.status === "out_for_delivery").length}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filter !== "all"
                ? "Try adjusting your filters"
                : "Customer orders will appear here"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                {/* Customer Info */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Customer Information
                  </h4>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Name:</span>{" "}
                    {order.customer?.firstName} {order.customer?.lastName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Email:</span>{" "}
                    {order.customer?.email}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Phone:</span>{" "}
                    {order.contactPhone}
                  </p>
                </div>

                {/* Delivery Info */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Delivery Address
                  </h4>
                  <p className="text-sm text-gray-700">
                    {order.deliveryAddress.street}
                  </p>
                  <p className="text-sm text-gray-700">
                    {order.deliveryAddress.city}, {order.deliveryAddress.state}{" "}
                    {order.deliveryAddress.zipCode}
                  </p>
                  {order.notes && (
                    <p className="text-sm text-gray-700 mt-2">
                      <span className="font-semibold">Notes:</span>{" "}
                      {order.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Order Items
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm bg-gray-50 p-2 rounded">
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

              {/* Order Total */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="text-gray-800">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="text-gray-800">
                    ${order.deliveryFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tax:</span>
                  <span className="text-gray-800">${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-green-600">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Payment: {order.paymentMethod.toUpperCase()} (
                  {order.paymentStatus})
                </p>
              </div>

              {/* Status Actions */}
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "confirmed")
                          }
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                          📤 Send to Kitchen
                        </button>
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "cancelled")
                          }
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                          Cancel Order
                        </button>
                      </>
                    )}
                    {order.status === "confirmed" && (
                      <p className="text-blue-600 font-semibold">
                        ✅ Sent to Kitchen - Waiting for preparation
                      </p>
                    )}
                    {order.status === "preparing" && (
                      <p className="text-purple-600 font-semibold">
                        🍳 Kitchen is preparing this order...
                      </p>
                    )}
                    {order.status === "out_for_delivery" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "delivered")
                        }
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
                        ✓ Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Delete Button - Only for Admin and cancelled/delivered orders */}
              {user?.role === "admin" &&
                (order.status === "cancelled" ||
                  order.status === "delivered") && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete Order (Admin Only)
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      ⚠️ This will permanently delete the order from the
                      database
                    </p>
                  </div>
                )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
