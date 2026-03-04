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
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome, {user?.name}!
        </h1>
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-semibold">
          {user?.role.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Today's Orders</p>
              <p className="text-4xl font-bold mt-2">{stats.todayOrders}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
              <svg
                className="w-8 h-8"
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
          </div>
        </div>

        {canAccessReports && (
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100 text-sm">Today's Revenue</p>
                <p className="text-4xl font-bold mt-2">
                  ${stats.todayRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                <svg
                  className="w-8 h-8"
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
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Active Tables</p>
              <p className="text-4xl font-bold mt-2">{stats.activeTables}</p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
              <svg
                className="w-8 h-8"
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
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-100 text-sm">Pending Orders</p>
              <p className="text-4xl font-bold mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
              <svg
                className="w-8 h-8"
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
        </div>
      </div>

      {canAccessReports && stats.lowStockItems > 0 && (
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 rounded">
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
              <p className="font-semibold text-red-800 dark:text-red-200">
                Low Stock Alert!
              </p>
              <p className="text-red-700 dark:text-red-300">
                {stats.lowStockItems} items are running low on stock.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["admin", "manager", "cashier", "waiter"].includes(user?.role) && (
            <a
              href="/pos"
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg text-center transition">
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
              className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg text-center transition">
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
                className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg text-center transition">
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
                className="bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg text-center transition">
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
