import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";

function OrdersChart({ data }) {
  if (!data || data.length === 0) return null;

  const maxOrders = Math.max(...data.map((d) => d.orders));
  const chartHeight = 180;
  const chartWidth = 700;
  const padding = 20;
  const stepX = (chartWidth - padding * 2) / (data.length - 1);

  const points = data.map((item, i) => {
    const x = padding + i * stepX;
    const y = chartHeight - (item.orders / maxOrders) * (chartHeight - 40);
    return { x, y, ...item };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaData = `${pathData} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="relative h-48">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${chartWidth} 200`}
        preserveAspectRatio="xMidYMid meet">
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1="0"
            y1={45 * i}
            x2={chartWidth}
            y2={45 * i}
            stroke="#f0f0f0"
            strokeWidth="1"
          />
        ))}
        <defs>
          <linearGradient id="ordersGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0d5f4e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0d5f4e" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={areaData} fill="url(#ordersGradient)" />
        <path d={pathData} fill="none" stroke="#0d5f4e" strokeWidth="3" />
        {points.map((point, i) => (
          <g key={i}>
            <circle cx={point.x} cy={point.y} r="4" fill="#0d5f4e" />
            <title>{`${point.day}: ${point.orders} orders`}</title>
          </g>
        ))}
        {points.map((point, i) => (
          <text
            key={i}
            x={point.x}
            y="195"
            textAnchor="middle"
            className="text-xs fill-gray-500">
            {point.day}
          </text>
        ))}
      </svg>
    </div>
  );
}

function WeeklyChart({ data }) {
  if (!data || data.length === 0) return null;

  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const chartHeight = 200;
  const chartWidth = 700;
  const padding = 20;
  const stepX = (chartWidth - padding * 2) / (data.length - 1);

  const points = data.map((item, i) => {
    const x = padding + i * stepX;
    const y = chartHeight - (item.revenue / maxRevenue) * (chartHeight - 40);
    return { x, y, ...item };
  });

  const pathData = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaData = `${pathData} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="relative h-64">
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${chartWidth} 250`}
        preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={i}
            x1="0"
            y1={50 * i}
            x2={chartWidth}
            y2={50 * i}
            stroke="#f0f0f0"
            strokeWidth="1"
          />
        ))}

        {/* Revenue area gradient */}
        <defs>
          <linearGradient
            id="revenueGradient"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%">
            <stop offset="0%" stopColor="#d4a843" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d4a843" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaData} fill="url(#revenueGradient)" />

        {/* Line */}
        <path d={pathData} fill="none" stroke="#d4a843" strokeWidth="3" />

        {/* Data points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle cx={point.x} cy={point.y} r="5" fill="#d4a843" />
            <title>{`${point.day}: $${point.revenue} (${point.orders} orders)`}</title>
          </g>
        ))}

        {/* Day labels */}
        {points.map((point, i) => (
          <text
            key={i}
            x={point.x}
            y="240"
            textAnchor="middle"
            className="text-xs fill-gray-500">
            {point.day}
          </text>
        ))}

        {/* Revenue labels */}
        {points.map((point, i) => (
          <text
            key={i}
            x={point.x}
            y={point.y - 10}
            textAnchor="middle"
            className="text-xs fill-gray-700 font-semibold">
            ${point.revenue}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    activeTables: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    revenueChange: 0,
    ordersChange: 0,
  });
  const [tables, setTables] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const canAccessReports = ["admin", "manager"].includes(user?.role);
      const canAccessInventory = ["admin", "manager"].includes(user?.role);

      const promises = [
        api.get("/tables").catch(() => ({ data: { data: [] } })),
        api.get("/orders?limit=5").catch(() => ({ data: { data: [] } })),
      ];

      if (canAccessReports) {
        promises.push(api.get("/reports/dashboard"));
        promises.push(api.get("/reports/weekly"));
        promises.push(api.get("/reports/best-sellers"));
      }

      if (canAccessInventory) {
        promises.push(api.get("/inventory"));
      }

      const results = await Promise.all(promises);
      const tablesRes = results[0];
      const ordersRes = results[1];
      const dashboardRes = canAccessReports ? results[2] : null;
      const weeklyRes = canAccessReports ? results[3] : null;
      const bestSellersRes = canAccessReports ? results[4] : null;
      const inventoryRes = canAccessInventory
        ? results[canAccessReports ? 5 : 2]
        : null;

      const tables = tablesRes.data.data;
      const orders = ordersRes.data.data;
      const dashboard = dashboardRes?.data.data;
      const weekly = weeklyRes?.data.data || [];
      const bestSellers = bestSellersRes?.data.data || [];
      const inventory = inventoryRes?.data.data || [];

      setTables(tables);
      setWeeklyData(weekly);
      setRecentOrders(orders.slice(0, 5));
      setBestSellers(bestSellers.slice(0, 5));
      setStats({
        todayOrders: dashboard?.todayOrders || 0,
        todayRevenue: dashboard?.todayRevenue || 0,
        activeTables: tables.filter((t) => t.status === "occupied").length,
        pendingOrders: dashboard?.pendingOrders || 0,
        lowStockItems: inventory.filter(
          (i) => i.quantity <= i.lowStockThreshold,
        ).length,
        revenueChange: dashboard?.revenueChange || 0,
        ordersChange: dashboard?.ordersChange || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessReports = ["admin", "manager"].includes(user?.role);

  return (
    <div className="space-y-6 pb-8">
      {/* Header with Time */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-[#d4a843] text-white rounded-xl font-semibold shadow-sm">
            {user?.role.toUpperCase()}
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-semibold text-gray-700">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            {stats.revenueChange !== 0 && (
              <span
                className={`px-2 py-1 ${stats.revenueChange > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-xs font-semibold rounded`}>
                {stats.revenueChange > 0 ? "+" : ""}
                {stats.revenueChange}%
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-1">Today's Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.todayRevenue.toFixed(0)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-700"
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
            {stats.ordersChange !== 0 && (
              <span
                className={`px-2 py-1 ${stats.ordersChange > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-xs font-semibold rounded`}>
                {stats.ordersChange > 0 ? "+" : ""}
                {stats.ordersChange}%
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-1">Today's Orders</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.todayOrders}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-700"
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
          </div>
          <p className="text-gray-500 text-sm mb-1">Pending Orders</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.pendingOrders}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-700"
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
          </div>
          <p className="text-gray-500 text-sm mb-1">Table Occupancy</p>
          <p className="text-2xl font-bold text-gray-900">
            {tables.length > 0
              ? Math.round((stats.activeTables / tables.length) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {canAccessReports && stats.lowStockItems > 0 && (
        <div className="bg-white border-l-4 border-red-500 p-5 rounded-2xl shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-red-600"
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
              <p className="font-semibold text-gray-800">Low Stock Alert!</p>
              <p className="text-sm text-gray-600">
                {stats.lowStockItems} items are running low on stock.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Revenue and Table Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Weekly Revenue
              </h2>
              <p className="text-sm text-gray-500">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d4a843]"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          {loading || weeklyData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-400">
              {loading ? "Loading chart data..." : "No data available"}
            </div>
          ) : (
            <WeeklyChart data={weeklyData} />
          )}
        </div>

        {/* Table Status */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Table Status</h2>
          <div className="grid grid-cols-3 gap-2">
            {tables.slice(0, 9).map((table) => {
              const statusColors = {
                occupied: "bg-[#0d5f4e] text-white",
                available: "bg-gray-200 text-gray-700",
                reserved: "bg-[#d4a843] text-white",
                cleaning: "bg-pink-200 text-pink-700",
              };

              return (
                <div
                  key={table._id}
                  className={`${statusColors[table.status] || statusColors.available} p-4 rounded-xl text-center transition hover:scale-105 cursor-pointer`}>
                  <div className="font-bold text-lg mb-1">
                    {table.tableNumber}
                  </div>
                  <div className="text-xs opacity-90 capitalize">
                    {table.status}
                  </div>
                  {table.status === "occupied" && (
                    <div className="text-xs mt-1">{table.capacity} guests</div>
                  )}
                  {table.status === "reserved" && (
                    <div className="text-xs mt-1">{table.capacity} guests</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available</span>
              <span className="font-semibold text-gray-800">
                {tables.filter((t) => t.status === "available").length}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Occupied</span>
              <span className="font-semibold text-gray-800">
                {tables.filter((t) => t.status === "occupied").length}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-600">Reserved</span>
              <span className="font-semibold text-gray-800">
                {tables.filter((t) => t.status === "reserved").length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Trend and Best Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Orders Trend */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Orders Trend</h2>
              <p className="text-sm text-gray-500">Weekly order volume</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#0d5f4e]"></div>
              <span className="text-sm text-gray-600">Orders</span>
            </div>
          </div>
          {loading || weeklyData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400">
              {loading ? "Loading..." : "No data"}
            </div>
          ) : (
            <OrdersChart data={weeklyData} />
          )}
        </div>

        {/* Best Sellers */}
        {canAccessReports && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Top Selling Items
                </h2>
                <p className="text-sm text-gray-500">Most popular dishes</p>
              </div>
              <a
                href="/reports"
                className="text-sm text-[#0d5f4e] hover:text-[#0a4a3c] font-medium">
                View All →
              </a>
            </div>
            {loading ? (
              <div className="h-48 flex items-center justify-center text-gray-400">
                Loading...
              </div>
            ) : bestSellers.length === 0 ? (
              <div className="h-48 flex items-center justify-center text-gray-400">
                No sales data yet
              </div>
            ) : (
              <div className="space-y-3">
                {bestSellers.map((item, index) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#d4a843] text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {item.item?.name || "Unknown Item"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.totalQuantity} sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0d5f4e]">
                        ${item.totalRevenue?.toFixed(0) || 0}
                      </p>
                      <p className="text-xs text-gray-500">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <p className="text-sm text-gray-500">Latest customer orders</p>
          </div>
          <a
            href="/orders"
            className="text-sm text-[#0d5f4e] hover:text-[#0a4a3c] font-medium">
            View All →
          </a>
        </div>
        {loading ? (
          <div className="h-32 flex items-center justify-center text-gray-400">
            Loading orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-gray-400">
            No recent orders
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Table
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Items
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Total
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const statusColors = {
                    pending: "bg-yellow-100 text-yellow-700",
                    preparing: "bg-blue-100 text-blue-700",
                    ready: "bg-green-100 text-green-700",
                    served: "bg-purple-100 text-purple-700",
                    paid: "bg-gray-100 text-gray-700",
                    cancelled: "bg-red-100 text-red-700",
                  };

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">
                        #{order._id?.slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.table?.tableNumber || "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                        ${order.total?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || statusColors.pending}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Summary */}
      {canAccessReports && weeklyData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#0d5f4e] to-[#0a4a3c] p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Weekly
              </span>
            </div>
            <p className="text-sm opacity-90 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold">
              $
              {weeklyData.reduce((sum, day) => sum + day.revenue, 0).toFixed(0)}
            </p>
            <p className="text-xs opacity-75 mt-2">
              Avg: $
              {(
                weeklyData.reduce((sum, day) => sum + day.revenue, 0) / 7
              ).toFixed(0)}
              /day
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#d4a843] to-[#b8923a] p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6"
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
              <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Weekly
              </span>
            </div>
            <p className="text-sm opacity-90 mb-2">Total Orders</p>
            <p className="text-3xl font-bold">
              {weeklyData.reduce((sum, day) => sum + day.orders, 0)}
            </p>
            <p className="text-xs opacity-75 mt-2">
              Avg:{" "}
              {Math.round(
                weeklyData.reduce((sum, day) => sum + day.orders, 0) / 7,
              )}{" "}
              orders/day
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-2xl shadow-lg text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full">
                Average
              </span>
            </div>
            <p className="text-sm opacity-90 mb-2">Order Value</p>
            <p className="text-3xl font-bold">
              $
              {weeklyData.reduce((sum, day) => sum + day.orders, 0) > 0
                ? (
                    weeklyData.reduce((sum, day) => sum + day.revenue, 0) /
                    weeklyData.reduce((sum, day) => sum + day.orders, 0)
                  ).toFixed(2)
                : "0.00"}
            </p>
            <p className="text-xs opacity-75 mt-2">Per order this week</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["admin", "manager", "cashier", "waiter"].includes(user?.role) && (
            <a
              href="/pos"
              className="bg-white border border-gray-200 hover:border-[#0d5f4e] hover:bg-gray-50 text-gray-700 p-4 rounded-xl text-center transition group">
              <div className="w-10 h-10 bg-[#0d5f4e] bg-opacity-10 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-5 h-5 text-[#0d5f4e]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">New Order</span>
            </a>
          )}
          {["admin", "kitchen"].includes(user?.role) && (
            <a
              href="/kitchen"
              className="bg-white border border-gray-200 hover:border-orange-500 hover:bg-gray-50 text-gray-700 p-4 rounded-xl text-center transition group">
              <div className="w-10 h-10 bg-orange-100 group-hover:bg-orange-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Kitchen</span>
            </a>
          )}
          {["admin", "manager"].includes(user?.role) && (
            <>
              <a
                href="/menu"
                className="bg-white border border-gray-200 hover:border-[#d4a843] hover:bg-gray-50 text-gray-700 p-4 rounded-xl text-center transition group">
                <div className="w-10 h-10 bg-[#d4a843] bg-opacity-10 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-5 h-5 text-[#d4a843]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Menu</span>
              </a>
              <a
                href="/reports"
                className="bg-white border border-gray-200 hover:border-[#0f7a62] hover:bg-gray-50 text-gray-700 p-4 rounded-xl text-center transition group">
                <div className="w-10 h-10 bg-[#0f7a62] bg-opacity-10 group-hover:bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-5 h-5 text-[#0f7a62]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Reports</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
