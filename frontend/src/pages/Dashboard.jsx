import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    activeTables: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  });
  const [tables, setTables] = useState([]);
  const [weeklyData, setWeeklyData] = useState([
    { day: "Mon", revenue: 4200, orders: 45 },
    { day: "Tue", revenue: 5800, orders: 62 },
    { day: "Wed", revenue: 7100, orders: 78 },
    { day: "Thu", revenue: 6800, orders: 71 },
    { day: "Fri", revenue: 9500, orders: 95 },
    { day: "Sat", revenue: 12800, orders: 128 },
    { day: "Sun", revenue: 11200, orders: 112 },
  ]);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      // Waiters and kitchen staff don't have access to reports/inventory
      const canAccessReports = ["admin", "manager"].includes(user?.role);
      const canAccessInventory = ["admin", "manager"].includes(user?.role);

      const promises = [
        api.get("/orders"),
        api.get("/tables").catch(() => ({ data: { data: [] } })),
      ];

      if (canAccessReports) {
        promises.push(api.get("/reports/daily"));
      }

      if (canAccessInventory) {
        promises.push(api.get("/inventory"));
      }

      const results = await Promise.all(promises);
      const ordersRes = results[0];
      const tablesRes = results[1];
      const dailyRes = canAccessReports ? results[2] : null;
      const inventoryRes = canAccessInventory
        ? results[canAccessReports ? 3 : 2]
        : null;

      const orders = ordersRes.data.data;
      const tables = tablesRes.data.data;
      const daily = dailyRes?.data.data;
      const inventory = inventoryRes?.data.data || [];

      setTables(tables);
      setStats({
        todayOrders: daily?.totalOrders || orders.length,
        todayRevenue: daily?.revenue || 0,
        activeTables: tables.filter((t) => t.status === "occupied").length,
        pendingOrders: orders.filter((o) =>
          ["pending", "preparing"].includes(o.status),
        ).length,
        lowStockItems: inventory.filter(
          (i) => i.quantity <= i.lowStockThreshold,
        ).length,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const canAccessReports = ["admin", "manager"].includes(user?.role);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name}!
        </h1>
        <span className="px-4 py-2 bg-[#d4a843] text-white rounded-xl font-semibold">
          {user?.role.toUpperCase()}
        </span>
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
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
              +23%
            </span>
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
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
              +12%
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Active Orders</p>
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
              -5%
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Reservations</p>
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
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
              +8%
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-1">Table Occupancy</p>
          <p className="text-2xl font-bold text-gray-900">
            {stats.activeTables > 0
              ? Math.round((stats.activeTables / 10) * 100)
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
                <div className="w-3 h-3 rounded-full bg-[#0d5f4e]"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#d4a843]"></div>
                <span className="text-gray-600">Orders</span>
              </div>
            </div>
          </div>
          <div className="relative h-64">
            <svg
              className="w-full h-full"
              viewBox="0 0 700 250"
              preserveAspectRatio="none">
              {/* Grid lines */}
              <line
                x1="0"
                y1="50"
                x2="700"
                y2="50"
                stroke="#f0f0f0"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="100"
                x2="700"
                y2="100"
                stroke="#f0f0f0"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="150"
                x2="700"
                y2="150"
                stroke="#f0f0f0"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="200"
                x2="700"
                y2="200"
                stroke="#f0f0f0"
                strokeWidth="1"
              />

              {/* Revenue area */}
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
              <path
                d="M 0 180 L 100 150 L 200 120 L 300 130 L 400 80 L 500 30 L 600 50 L 600 220 L 500 220 L 400 220 L 300 220 L 200 220 L 100 220 L 0 220 Z"
                fill="url(#revenueGradient)"
              />
              <path
                d="M 0 180 L 100 150 L 200 120 L 300 130 L 400 80 L 500 30 L 600 50"
                fill="none"
                stroke="#d4a843"
                strokeWidth="3"
              />

              {/* Day labels */}
              {weeklyData.map((day, i) => (
                <text
                  key={day.day}
                  x={i * 100 + 50}
                  y="240"
                  textAnchor="middle"
                  className="text-xs fill-gray-500">
                  {day.day}
                </text>
              ))}
            </svg>
          </div>
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
                  className={`${statusColors[table.status] || statusColors.available} p-4 rounded-xl text-center transition hover:scale-105`}>
                  <div className="font-bold text-lg mb-1">
                    {table.tableNumber}
                  </div>
                  <div className="text-xs opacity-90 capitalize">
                    {table.status}
                  </div>
                  {table.status === "occupied" && (
                    <>
                      <div className="text-xs mt-1">
                        {table.capacity} guests
                      </div>
                      <div className="text-xs opacity-75">45 min</div>
                    </>
                  )}
                  {table.status === "reserved" && (
                    <>
                      <div className="text-xs mt-1">
                        {table.capacity} guests
                      </div>
                      <div className="text-xs opacity-75">7:30 PM</div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
