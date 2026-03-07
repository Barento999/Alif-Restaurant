import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import OrderNotifications from "./OrderNotifications";
import api from "../services/api";

export default function LayoutWithSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Listen for logout event from sidebar
  useEffect(() => {
    const handleLogoutEvent = () => handleLogout();
    window.addEventListener("logout", handleLogoutEvent);
    return () => window.removeEventListener("logout", handleLogoutEvent);
  }, []);

  // Fetch orders for notifications (only for waiters, managers, and admins)
  useEffect(() => {
    if (!user || !["waiter", "manager", "admin"].includes(user.role)) {
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data.data || []);
      } catch (error) {
        console.error("Error fetching orders for notifications:", error);
      }
    };

    // Initial fetch
    fetchOrders();

    // Poll every 5 seconds for updates
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, [user]);

  // Search functionality
  useEffect(() => {
    const searchData = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setSearching(true);
      try {
        const [ordersRes, menuRes, tablesRes] = await Promise.all([
          api.get(`/orders`).catch(() => ({ data: { data: [] } })),
          api.get(`/menu`).catch(() => ({ data: { data: [] } })),
          api.get(`/tables`).catch(() => ({ data: { data: [] } })),
        ]);

        const query = searchQuery.toLowerCase();

        // Collect results by category
        const orderResults = [];
        const menuResults = [];
        const tableResults = [];

        // Search orders
        ordersRes.data.data
          ?.filter(
            (order) =>
              order.orderNumber?.toLowerCase().includes(query) ||
              order.table?.tableNumber?.toLowerCase().includes(query),
          )
          .forEach((order) => {
            orderResults.push({
              type: "order",
              title: order.orderNumber,
              subtitle: `Table: ${order.table?.tableNumber} - ${order.status}`,
              link: `/orders?order=${order._id}`,
              itemId: order._id,
            });
          });

        // Search menu items
        menuRes.data.data
          ?.filter((item) => item.name?.toLowerCase().includes(query))
          .forEach((item) => {
            menuResults.push({
              type: "menu",
              title: item.name,
              subtitle: `${item.category?.name} - $${item.price}`,
              link: `/menu?item=${item._id}`,
              itemId: item._id,
            });
          });

        // Search tables
        tablesRes.data.data
          ?.filter((table) => table.tableNumber?.toLowerCase().includes(query))
          .forEach((table) => {
            tableResults.push({
              type: "table",
              title: table.tableNumber,
              subtitle: `Capacity: ${table.capacity} - ${table.status}`,
              link: `/tables?table=${table._id}`,
              itemId: table._id,
            });
          });

        // Show only the category with the most results
        let finalResults = [];
        if (
          orderResults.length > 0 ||
          menuResults.length > 0 ||
          tableResults.length > 0
        ) {
          if (
            orderResults.length >= menuResults.length &&
            orderResults.length >= tableResults.length
          ) {
            finalResults = orderResults.slice(0, 5);
          } else if (menuResults.length >= tableResults.length) {
            finalResults = menuResults.slice(0, 5);
          } else {
            finalResults = tableResults.slice(0, 5);
          }
        }

        setSearchResults(finalResults);
        setShowResults(finalResults.length > 0);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setSearching(false);
      }
    };

    const debounce = setTimeout(searchData, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleResultClick = (link) => {
    navigate(link);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Order Notifications */}
      {user && ["waiter", "manager", "admin"].includes(user.role) && (
        <OrderNotifications orders={orders} />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-[#f8f9fa] border-b border-gray-200">
          <div className="flex items-center justify-between h-20 px-6 lg:px-10">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-sm lg:max-w-sm mx-0 relative">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search orders, reservations, menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    searchResults.length > 0 && setShowResults(true)
                  }
                  onBlur={() => setTimeout(() => setShowResults(false), 200)}
                  className="w-full pl-12 pr-6 py-3 bg-[#f5f5f0] border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0d5f4e] focus:border-transparent transition-all"
                />
                <svg
                  className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {searching && (
                  <div className="absolute right-4 top-3.5">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleResultClick(result.link);
                      }}
                      className="w-full px-4 py-3 hover:bg-gray-50 transition text-left border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            result.type === "order"
                              ? "bg-blue-100 text-blue-600"
                              : result.type === "menu"
                                ? "bg-green-100 text-green-600"
                                : "bg-purple-100 text-purple-600"
                          }`}>
                          {result.type === "order" && (
                            <svg
                              className="w-5 h-5"
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
                          )}
                          {result.type === "menu" && (
                            <svg
                              className="w-5 h-5"
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
                          )}
                          {result.type === "table" && (
                            <svg
                              className="w-5 h-5"
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
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {result.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {result.subtitle}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {showResults &&
                searchResults.length === 0 &&
                searchQuery.length >= 2 &&
                !searching && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50">
                    <p className="text-sm text-gray-500 text-center">
                      No results found for "{searchQuery}"
                    </p>
                  </div>
                )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notification bell with badge */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors bg-[#f5f5f0]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex items-center justify-center rounded-full h-5 w-5 bg-yellow-400 text-white text-xs font-bold">
                    3
                  </span>
                </span>
              </button>

              {/* Message icon */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors bg-[#f5f5f0]">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </button>

              {/* Date Display */}
              <div className="hidden md:flex items-center px-5 py-2.5 bg-[#0d5f4e] text-white rounded-xl text-sm font-medium shadow-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
