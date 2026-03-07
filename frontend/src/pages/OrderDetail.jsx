import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../services/api";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      await loadOrder();
      setShowStatusModal(false);
      setNewStatus("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      preparing: "bg-blue-100 text-blue-800 border-blue-300",
      ready: "bg-green-100 text-green-800 border-green-300",
      served: "bg-purple-100 text-purple-800 border-purple-300",
      paid: "bg-gray-100 text-gray-800 border-gray-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getValidStatusTransitions = (currentStatus) => {
    const statusWorkflow = {
      pending: ["preparing", "cancelled"],
      preparing: ["ready", "cancelled"],
      ready: ["served"],
      served: ["paid"],
      paid: [],
      cancelled: [],
    };
    return statusWorkflow[currentStatus] || [];
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString();
  };

  const getTimeDifference = (start, end) => {
    if (!start || !end) return "N/A";
    const diff = new Date(end) - new Date(start);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0d5f4e]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/order-management")}
            className="px-6 py-2.5 bg-[#0d5f4e] text-white rounded-xl hover:bg-[#0f7a62] font-medium transition">
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition">
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Details</h1>
            <p className="text-gray-600 mt-1">
              Complete information for {order.orderNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print
          </button>
          <button
            onClick={loadOrder}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0d5f4e] text-white rounded-xl hover:bg-[#0f7a62] font-medium transition">
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
            Refresh
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {order.orderNumber}
                  </h2>
                  {order.priority && order.priority !== "normal" && (
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-bold ${
                        order.priority === "urgent"
                          ? "bg-red-100 text-red-800 animate-pulse"
                          : "bg-orange-100 text-orange-800"
                      }`}>
                      {order.priority === "urgent" ? "🔥 URGENT" : "⚡ HIGH"}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">
                  Created {formatTime(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-4 py-2 rounded-xl text-sm font-bold border-2 ${getStatusColor(
                    order.status,
                  )}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">Table</p>
                <p className="text-xl font-bold text-gray-800">
                  {order.table?.tableNumber || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.table?.capacity} seats
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">Waiter</p>
                <p className="text-lg font-bold text-gray-800">
                  {order.waiter?.name || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {order.waiter?.email}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">Items</p>
                <p className="text-xl font-bold text-gray-800">
                  {order.items?.length || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Total items</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-600 mb-1">Total</p>
                <p className="text-xl font-bold text-[#0d5f4e]">
                  ${order.total?.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">Including tax</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#0d5f4e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  {item.menuItem?.image && (
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-800 text-lg">
                      {item.menuItem?.name || "Unknown Item"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                    {item.menuItem?.ingredients &&
                      item.menuItem.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.menuItem.ingredients.map((ing, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white text-gray-600 px-2 py-1 rounded border border-gray-200">
                              {ing}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  ${order.subtotal?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%):</span>
                <span className="font-semibold">${order.tax?.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span className="font-semibold">
                    -${order.discount?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-[#0d5f4e]">
                  ${order.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Special Instructions
              </h3>
              <p className="text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Modification History */}
          {order.modificationHistory &&
            order.modificationHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Modification History
                </h3>
                <div className="space-y-3">
                  {order.modificationHistory.map((mod, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            Modified by: {mod.modifiedBy?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatTime(mod.modifiedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Change</p>
                          <p className="font-semibold">
                            <span className="text-red-600">
                              ${mod.previousTotal?.toFixed(2)}
                            </span>
                            {" → "}
                            <span className="text-green-600">
                              ${mod.newTotal?.toFixed(2)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Items: {mod.previousItems?.length} →{" "}
                        {mod.newItems?.length}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg
                className="w-6 h-6 text-[#0d5f4e]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Status Timeline
            </h3>
            {order.statusTimestamps && (
              <div className="space-y-4">
                {Object.entries(order.statusTimestamps)
                  .filter(([_, timestamp]) => timestamp)
                  .sort((a, b) => new Date(a[1]) - new Date(b[1]))
                  .map(([status, timestamp], index, array) => {
                    const nextTimestamp = array[index + 1]?.[1];
                    const duration = nextTimestamp
                      ? getTimeDifference(timestamp, nextTimestamp)
                      : status === order.status
                        ? getTimeDifference(timestamp, new Date())
                        : null;

                    return (
                      <div key={status} className="relative pl-8">
                        <div
                          className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white ${
                            status === order.status
                              ? "bg-[#0d5f4e] ring-4 ring-[#0d5f4e] ring-opacity-20"
                              : "bg-gray-300"
                          }`}></div>
                        {index < array.length - 1 && (
                          <div className="absolute left-3 top-7 w-0.5 h-full bg-gray-200"></div>
                        )}
                        <div>
                          <p
                            className={`font-semibold capitalize ${
                              status === order.status
                                ? "text-[#0d5f4e]"
                                : "text-gray-600"
                            }`}>
                            {status}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(timestamp)}
                          </p>
                          {duration && (
                            <p className="text-xs text-gray-400 mt-1">
                              Duration: {duration}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 print:hidden">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {getValidStatusTransitions(order.status).length > 0 && (
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="w-full px-4 py-3 bg-[#0d5f4e] text-white rounded-xl hover:bg-[#0f7a62] font-medium transition flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Update Status
                </button>
              )}
              <button
                onClick={() => navigate(`/order-management?order=${order._id}`)}
                className="w-full px-4 py-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-medium transition flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Manage Order
              </button>
              <button
                onClick={() => navigate(`/table-map`)}
                className="w-full px-4 py-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 font-medium transition flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                View Table Map
              </button>
            </div>
          </div>

          {/* Order Metadata */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Order Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-gray-800">{order._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-800">
                  {formatTime(order.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-800">
                  {formatTime(order.updatedAt)}
                </span>
              </div>
              {order.table?.location && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="text-gray-800">{order.table.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                Update Order Status
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Current status: {order.status}
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent">
                <option value="">-- Select Status --</option>
                {getValidStatusTransitions(order.status).map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus("");
                }}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition">
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                disabled={!newStatus}
                className="flex-1 px-4 py-2.5 bg-[#0d5f4e] text-white rounded-lg hover:bg-[#0f7a62] font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
