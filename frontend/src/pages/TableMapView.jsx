import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function TableMapView() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or floor
  const [filterStatus, setFilterStatus] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadData();

    // Auto-refresh every 10 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadData, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      const [tablesRes, ordersRes] = await Promise.all([
        api.get("/tables"),
        api.get("/orders"),
      ]);

      setTables(tablesRes.data.data);
      setOrders(ordersRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading data:", error);
      setLoading(false);
    }
  };

  // Get active order for a table
  const getTableOrder = (tableId) => {
    return orders.find(
      (order) =>
        order.table?._id === tableId &&
        !["paid", "cancelled"].includes(order.status),
    );
  };

  // Get table statistics
  const getTableStats = (tableId) => {
    const order = getTableOrder(tableId);
    if (!order) return null;

    const timeInStatus = getTimeInStatus(order);
    const itemCount = order.items?.length || 0;
    const total = order.total || 0;

    return {
      order,
      timeInStatus,
      itemCount,
      total,
    };
  };

  // Calculate time in current status
  const getTimeInStatus = (order) => {
    const statusTimestamp =
      order.statusTimestamps?.[order.status] || order.createdAt;
    const now = new Date();
    const statusTime = new Date(statusTimestamp);
    const diffMs = now - statusTime;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      available: "bg-green-500",
      occupied: "bg-red-500",
      reserved: "bg-yellow-500",
      pending: "bg-yellow-400",
      preparing: "bg-blue-500",
      ready: "bg-green-400",
      served: "bg-purple-500",
    };
    return colors[status] || "bg-gray-500";
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      preparing: "bg-blue-100 text-blue-800 border-blue-300",
      ready: "bg-green-100 text-green-800 border-green-300",
      served: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  // Navigate to order details
  const handleTableClick = (table) => {
    const order = getTableOrder(table._id);
    if (order) {
      navigate(`/orders?order=${order._id}`);
    } else {
      navigate(`/pos?table=${table._id}`);
    }
  };

  // Filter tables
  const filteredTables = tables.filter((table) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "available") return !getTableOrder(table._id);
    if (filterStatus === "occupied") return !!getTableOrder(table._id);

    const order = getTableOrder(table._id);
    return order?.status === filterStatus;
  });

  // Group tables by location
  const tablesByLocation = filteredTables.reduce((acc, table) => {
    const location = table.location || "Main Floor";
    if (!acc[location]) acc[location] = [];
    acc[location].push(table);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0d5f4e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Table Map View</h1>
          <p className="text-gray-600 mt-1">
            Real-time overview of all tables and their order status
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition ${
              autoRefresh
                ? "bg-[#0d5f4e] text-white hover:bg-[#0f7a62]"
                : "bg-white border border-gray-200 text-gray-700 hover:border-[#0d5f4e]"
            }`}>
            <svg
              className={`w-5 h-5 ${autoRefresh ? "animate-spin" : ""}`}
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
            <span>{autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}</span>
          </button>
          <button
            onClick={loadData}
            className="flex items-center space-x-2 bg-[#0d5f4e] text-white px-4 py-2.5 rounded-xl hover:bg-[#0f7a62] font-medium transition">
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
            <span>Refresh Now</span>
          </button>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {tables.length}
              </p>
              <p className="text-xs text-gray-600">Total Tables</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
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
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {tables.filter((t) => !getTableOrder(t._id)).length}
              </p>
              <p className="text-xs text-gray-600">Available</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
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
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {tables.filter((t) => getTableOrder(t._id)).length}
              </p>
              <p className="text-xs text-gray-600">Occupied</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-yellow-600"
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
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  orders.filter(
                    (o) =>
                      o.status === "pending" &&
                      o.status !== "paid" &&
                      o.status !== "cancelled",
                  ).length
                }
              </p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {
                  orders.filter(
                    (o) =>
                      o.status === "preparing" &&
                      o.status !== "paid" &&
                      o.status !== "cancelled",
                  ).length
                }
              </p>
              <p className="text-xs text-gray-600">Preparing</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
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
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {
                  orders.filter(
                    (o) =>
                      (o.status === "ready" || o.status === "served") &&
                      o.status !== "paid" &&
                      o.status !== "cancelled",
                  ).length
                }
              </p>
              <p className="text-xs text-gray-600">Ready/Served</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filterStatus === "all"
              ? "bg-[#0d5f4e] text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-[#0d5f4e]"
          }`}>
          All Tables ({tables.length})
        </button>
        <button
          onClick={() => setFilterStatus("available")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filterStatus === "available"
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-green-600"
          }`}>
          Available ({tables.filter((t) => !getTableOrder(t._id)).length})
        </button>
        <button
          onClick={() => setFilterStatus("occupied")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filterStatus === "occupied"
              ? "bg-red-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-red-600"
          }`}>
          Occupied ({tables.filter((t) => getTableOrder(t._id)).length})
        </button>
        <button
          onClick={() => setFilterStatus("pending")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filterStatus === "pending"
              ? "bg-yellow-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-yellow-600"
          }`}>
          Pending Orders
        </button>
        <button
          onClick={() => setFilterStatus("preparing")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filterStatus === "preparing"
              ? "bg-blue-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-blue-600"
          }`}>
          Preparing
        </button>
        <button
          onClick={() => setFilterStatus("ready")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            filterStatus === "ready"
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-green-600"
          }`}>
          Ready to Serve
        </button>
      </div>

      {/* Tables Grid by Location */}
      {Object.entries(tablesByLocation).map(([location, locationTables]) => (
        <div key={location}>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-600"
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
            {location}
            <span className="text-sm font-normal text-gray-600">
              ({locationTables.length} tables)
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {locationTables.map((table) => {
              const stats = getTableStats(table._id);
              const hasOrder = !!stats;

              return (
                <div
                  key={table._id}
                  onClick={() => handleTableClick(table)}
                  className={`relative bg-white rounded-xl shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    hasOrder
                      ? "border-red-300 bg-red-50"
                      : "border-green-300 bg-green-50"
                  }`}>
                  {/* Status Indicator */}
                  <div className="absolute top-2 right-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        hasOrder ? "bg-red-500 animate-pulse" : "bg-green-500"
                      }`}></div>
                  </div>

                  {/* Table Number */}
                  <div className="text-center mb-3">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {table.tableNumber}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {table.capacity} seats
                    </p>
                  </div>

                  {/* Order Info */}
                  {hasOrder ? (
                    <div className="space-y-2">
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-semibold text-center border ${getStatusBadgeColor(
                          stats.order.status,
                        )}`}>
                        {stats.order.status.toUpperCase()}
                      </div>

                      {stats.order.priority &&
                        stats.order.priority !== "normal" && (
                          <div
                            className={`px-2 py-1 rounded-lg text-xs font-bold text-center ${
                              stats.order.priority === "urgent"
                                ? "bg-red-100 text-red-800 border border-red-300 animate-pulse"
                                : "bg-orange-100 text-orange-800 border border-orange-300"
                            }`}>
                            {stats.order.priority === "urgent"
                              ? "🔥 URGENT"
                              : "⚡ HIGH"}
                          </div>
                        )}

                      <div className="text-xs text-gray-700 space-y-1">
                        <div className="flex justify-between">
                          <span>Order:</span>
                          <span className="font-semibold">
                            {stats.order.orderNumber}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Items:</span>
                          <span className="font-semibold">
                            {stats.itemCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span className="font-semibold text-[#0d5f4e]">
                            ${stats.total.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-semibold text-orange-600">
                            {stats.timeInStatus}
                          </span>
                        </div>
                        {stats.order.waiter?.name && (
                          <div className="flex justify-between">
                            <span>Waiter:</span>
                            <span className="font-semibold truncate ml-1">
                              {stats.order.waiter.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-semibold text-green-700">
                        Available
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Click to create order
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filteredTables.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <p className="text-lg font-medium text-gray-600">No tables found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
