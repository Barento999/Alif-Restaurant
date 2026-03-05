import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchOrders, updateOrderStatus } from "../features/orders/orderSlice";
import api from "../services/api";

export default function OrderManagement() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
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
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      await api.delete(`/orders/${orderId}`);
      loadOrders();
      alert("Order deleted successfully");
    } catch (error) {
      alert("Error deleting order");
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
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const statusOptions = ["pending", "preparing", "ready", "served", "paid"];

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
                        : ""
                    }`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm font-semibold text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.table?.tableNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.waiter?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#0d5f4e]">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="text-[#0d5f4e] hover:text-[#0f7a62] font-medium">
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-red-600 hover:text-red-700 font-medium">
                        Delete
                      </button>
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
    </div>
  );
}
