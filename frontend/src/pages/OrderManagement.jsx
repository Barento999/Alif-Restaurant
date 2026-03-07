import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchOrders,
  updateOrderStatus,
  cancelOrder,
  modifyOrder,
} from "../features/orders/orderSlice";
import { fetchMenu } from "../features/menu/menuSlice";
import api from "../services/api";
import ModifyOrderModal from "../components/ModifyOrderModal";

export default function OrderManagement() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [modifyingOrder, setModifyingOrder] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    loadOrders();
    dispatch(fetchMenu());
  }, [selectedStatus]);

  useEffect(() => {
    // Check if there's an order ID in the URL
    const orderId = searchParams.get("order");
    if (orderId && orders.length > 0) {
      setHighlightedOrderId(orderId);
      // Scroll to the order after a short delay
      setTimeout(() => {
        const element = document.getElementById(`order-${orderId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          // Remove highlight after 3 seconds
          setTimeout(() => {
            setHighlightedOrderId(null);
            setSearchParams({});
          }, 3000);
        }
      }, 300);
    }
  }, [searchParams, orders]);

  const loadOrders = () => {
    if (selectedStatus === "all") {
      dispatch(fetchOrders());
    } else {
      dispatch(fetchOrders(selectedStatus));
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
      loadOrders();
    } catch (error) {
      alert("Error updating order status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!deleteReason || deleteReason.trim().length < 5) {
      alert("Please provide a reason for deletion (minimum 5 characters)");
      return;
    }

    try {
      await api.delete(`/orders/${orderToDelete}`, {
        data: { reason: deleteReason },
      });
      loadOrders();
      alert("Order deleted successfully");
      setShowDeleteModal(false);
      setDeleteReason("");
      setOrderToDelete(null);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error deleting order";
      alert(errorMsg);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      served: "bg-purple-100 text-purple-800",
      paid: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const statusOptions = [
    "pending",
    "preparing",
    "ready",
    "served",
    "paid",
    "cancelled",
  ];

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      alert("Order cancelled successfully");
      loadOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Error: " + (error.message || "Failed to cancel order"));
    }
  };

  const handleModifyOrder = (order) => {
    setModifyingOrder(order);
  };

  const handleSaveModifiedOrder = async (items) => {
    try {
      await dispatch(modifyOrder({ id: modifyingOrder._id, items })).unwrap();
      alert("Order updated successfully");
      setModifyingOrder(null);
      loadOrders();
    } catch (error) {
      console.error("Error modifying order:", error);
      alert("Error: " + (error.message || "Failed to modify order"));
    }
  };

  const filteredOrders = (() => {
    const orderId = searchParams.get("order");
    // If searching for a specific order, show only that order
    if (orderId) {
      return orders.filter((o) => o._id === orderId);
    }
    // Otherwise, filter by status as usual
    return selectedStatus === "all"
      ? orders
      : orders.filter((o) => o.status === selectedStatus);
  })();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          {searchParams.get("order") && (
            <p className="text-gray-600 mt-1">Viewing searched order</p>
          )}
        </div>
        <div className="flex gap-3">
          {searchParams.get("order") && (
            <button
              onClick={() => {
                setSearchParams({});
                setHighlightedOrderId(null);
              }}
              className="flex items-center space-x-2 bg-[#d4a843] text-white px-6 py-2.5 rounded-xl hover:bg-[#c49739] font-medium transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Show All Orders
            </button>
          )}
          <button
            onClick={loadOrders}
            className="flex items-center space-x-2 bg-[#0d5f4e] text-white px-6 py-2.5 rounded-xl hover:bg-[#0f7a62] font-medium transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Status Filter */}
      {!searchParams.get("order") && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              selectedStatus === "all"
                ? "bg-[#0d5f4e] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-[#0d5f4e] hover:bg-gray-50"
            }`}>
            All Orders ({orders.length})
          </button>
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-xl font-medium capitalize transition ${
                selectedStatus === status
                  ? "bg-[#0d5f4e] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-[#0d5f4e] hover:bg-gray-50"
              }`}>
              {status} ({orders.filter((o) => o.status === status).length})
            </button>
          ))}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Order #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Table
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Waiter
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    id={`order-${order._id}`}
                    className={`hover:bg-gray-50 transition ${
                      highlightedOrderId === order._id
                        ? "bg-[#d4a843] bg-opacity-20 animate-pulse"
                        : order.status === "cancelled"
                          ? "bg-red-50 opacity-75"
                          : ""
                    }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`font-mono text-sm font-semibold ${
                          order.status === "cancelled"
                            ? "text-gray-500 line-through"
                            : "text-gray-900"
                        }`}>
                        {order.orderNumber}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        order.status === "cancelled"
                          ? "text-gray-500"
                          : "text-gray-900"
                      }`}>
                      {order.table?.tableNumber || "N/A"}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        order.status === "cancelled"
                          ? "text-gray-500"
                          : "text-gray-900"
                      }`}>
                      {order.waiter?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                        order.status === "cancelled"
                          ? "text-gray-500 line-through"
                          : "text-[#0d5f4e]"
                      }`}>
                      ${order.total?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize bg-gray-50 border border-gray-200 ${getStatusColor(order.status)}`}>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.status === "cancelled" ? (
                        // Cancelled orders: minimal actions
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition">
                            View
                          </button>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition">
                              Delete
                            </button>
                          )}
                        </div>
                      ) : order.status === "pending" ? (
                        // Pending orders: full action set with better styling
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#0d5f4e] bg-opacity-10 text-[#0d5f4e] hover:bg-opacity-20 font-medium transition">
                            View
                          </button>
                          <button
                            onClick={() => handleModifyOrder(order)}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition">
                            Modify
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 font-medium transition">
                            Cancel
                          </button>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition">
                              Delete
                            </button>
                          )}
                        </div>
                      ) : (
                        // Other statuses: view and delete only
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="px-3 py-1.5 rounded-lg bg-[#0d5f4e] bg-opacity-10 text-[#0d5f4e] hover:bg-opacity-20 font-medium transition">
                            View
                          </button>
                          {user?.role === "admin" && (
                            <button
                              onClick={() => handleDeleteOrder(order._id)}
                              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition">
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Order Details - {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
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

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Table
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {selectedOrder.table?.tableNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Waiter
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {selectedOrder.waiter?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created
                  </p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {item.menuItem?.image && (
                        <img
                          src={item.menuItem.image}
                          alt={item.menuItem.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-white">
                          {item.menuItem?.name || "Unknown Item"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ${item.price} × {item.quantity}
                        </p>
                        {item.menuItem?.ingredients &&
                          item.menuItem.ingredients.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.menuItem.ingredients
                                .slice(0, 4)
                                .map((ing, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-500">
                                    {ing}
                                  </span>
                                ))}
                              {item.menuItem.ingredients.length > 4 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{item.menuItem.ingredients.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    Notes
                  </h3>
                  <p className="p-3 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 text-gray-800 dark:text-white">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* Totals */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax:</span>
                  <span>${selectedOrder.tax?.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-${selectedOrder.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total:</span>
                  <span>${selectedOrder.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modify Order Modal */}
      {modifyingOrder && (
        <ModifyOrderModal
          order={modifyingOrder}
          onClose={() => setModifyingOrder(null)}
          onSave={handleSaveModifiedOrder}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Delete Order
                  </h3>
                  <p className="text-sm text-gray-600">
                    Admin action - requires reason
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. The
                  order will be permanently deleted from the system.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Deletion *
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Enter reason for deleting this order (minimum 5 characters)..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows="4"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  {deleteReason.length}/5 characters minimum
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReason("");
                  setOrderToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">
                Cancel
              </button>
              <button
                onClick={confirmDeleteOrder}
                disabled={deleteReason.trim().length < 5}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
