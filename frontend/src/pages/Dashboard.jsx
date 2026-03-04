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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-500 mr-3"
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
            <div>
              <p className="font-semibold text-red-800">Low Stock Alert!</p>
              <p className="text-red-700">
                {stats.lowStockItems} items are running low on stock.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["admin", "manager", "cashier", "waiter"].includes(user?.role) && (
            <a
              href="/pos"
              className="bg-[#0d5f4e] hover:bg-[#0f7a62] text-white p-4 rounded-xl text-center transition">
              <svg
                className="w-8 h-8 mx-auto mb-2"
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
              New Order
            </a>
          )}
          {["admin", "kitchen"].includes(user?.role) && (
            <a
              href="/kitchen"
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl text-center transition">
              <svg
                className="w-8 h-8 mx-auto mb-2"
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
              Kitchen
            </a>
          )}
          {["admin", "manager"].includes(user?.role) && (
            <>
              <a
                href="/menu"
                className="bg-[#d4a843] hover:bg-[#c09838] text-white p-4 rounded-xl text-center transition">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
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
                Menu
              </a>
              <a
                href="/reports"
                className="bg-[#0f7a62] hover:bg-[#0d5f4e] text-white p-4 rounded-xl text-center transition">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
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
                Reports
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
