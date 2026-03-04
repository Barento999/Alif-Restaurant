import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
  addOrderRealtime,
  updateOrderRealtime,
} from "../features/orders/orderSlice";
import { io } from "socket.io-client";

export default function KitchenScreen() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    // Fetch all orders and filter on frontend
    dispatch(fetchOrders());

    const socket = io("http://localhost:5000");
    socket.on("newOrder", (order) => dispatch(addOrderRealtime(order)));
    socket.on("orderStatusUpdate", (order) =>
      dispatch(updateOrderRealtime(order)),
    );

    return () => socket.disconnect();
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
  };

  const activeOrders = orders.filter((o) =>
    ["pending", "preparing"].includes(o.status),
  );

  console.log("=== KITCHEN SCREEN DEBUG ===");
  console.log("Total orders in Redux:", orders.length);
  console.log("Active orders (pending/preparing):", activeOrders.length);
  console.log(
    "Orders:",
    orders.map((o) => ({ orderNumber: o.orderNumber, status: o.status })),
  );

  const pendingOrders = activeOrders.filter((o) => o.status === "pending");
  const preparingOrders = activeOrders.filter((o) => o.status === "preparing");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Kitchen Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
            Pending: {pendingOrders.length}
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
            Preparing: {preparingOrders.length}
          </div>
        </div>
      </div>

      {activeOrders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
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
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            All Caught Up!
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No pending orders at the moment
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map((order) => (
            <div
              key={order._id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${
                order.status === "pending"
                  ? "border-yellow-500"
                  : "border-blue-500"
              } transform transition-all hover:scale-105`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    order.status === "pending" ? "bg-yellow-500" : "bg-blue-500"
                  }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Table
                </p>
                <p className="text-lg font-bold text-gray-800 dark:text-white">
                  {order.table?.tableNumber}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Items:
                </p>
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <span className="text-gray-800 dark:text-white">
                      {item.menuItem?.name}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-bold">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 p-3 mb-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <span className="font-semibold">Note:</span> {order.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => handleStatusChange(order._id, "preparing")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Start Cooking</span>
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => handleStatusChange(order._id, "ready")}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center space-x-2">
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
                    <span>Mark Ready</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
