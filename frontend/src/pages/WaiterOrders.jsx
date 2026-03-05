import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
  addOrderRealtime,
  updateOrderRealtime,
} from "../features/orders/orderSlice";
import { io } from "socket.io-client";

export default function WaiterOrders() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.auth);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchOrders());

    // Setup Socket.io for real-time updates
    const socket = io("http://localhost:5000");

    socket.on("newOrder", (order) => {
      // Only add if it's assigned to this waiter
      if (order.waiter?._id === user?.id) {
        dispatch(addOrderRealtime(order));
      }
    });

    socket.on("orderStatusUpdate", (order) => {
      // Update if it's assigned to this waiter
      if (order.waiter?._id === user?.id) {
        dispatch(updateOrderRealtime(order));
      }
    });

    return () => socket.disconnect();
  }, [dispatch, user?.id]);

  // Filter orders assigned to this waiter
  // Use 'id' field from user object (backend returns 'id' not '_id')
  const myOrders = orders.filter((order) => {
    const orderWaiterId =
      order.waiter?._id?.toString() || order.waiter?.toString();
    const currentUserId = user?.id?.toString();
    console.log("Comparing:", {
      orderWaiterId,
      currentUserId,
      match: orderWaiterId === currentUserId,
    });
    return orderWaiterId === currentUserId;
  });

  console.log("=== WAITER ORDERS DEBUG ===");
  console.log("Current User:", user);
  console.log("Current User ID:", user?.id);
  console.log("Total Orders:", orders.length);
  console.log("My Orders:", myOrders.length);
  if (orders.length > 0) {
    console.log("Sample Order:", orders[0]);
    console.log("Sample Order Waiter:", orders[0]?.waiter);
  }

  const filteredOrders =
    selectedStatus === "all"
      ? myOrders
      : myOrders.filter((o) => o.status === selectedStatus);

  const handleMarkServed = async (orderId) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: "served" }));
      dispatch(fetchOrders());
    } catch (error) {
      alert("Error updating order status");
    }
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Orders
        </h1>
        <button
          onClick={() => dispatch(fetchOrders())}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
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

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedStatus === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}>
          All ({myOrders.length})
        </button>
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
              selectedStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}>
            {status} ({myOrders.filter((o) => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400"
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
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              No orders found
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Table:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {order.table?.tableNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Items:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {order.items?.length || 0}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 max-h-48 overflow-y-auto space-y-2">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white dark:bg-gray-600 p-2 rounded">
                    {item.menuItem?.image && (
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-800 dark:text-white font-medium truncate">
                          {item.menuItem?.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          x{item.quantity}
                        </span>
                      </div>
                      {item.menuItem?.ingredients &&
                        item.menuItem.ingredients.length > 0 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {item.menuItem.ingredients.slice(0, 3).join(", ")}
                            {item.menuItem.ingredients.length > 3 && "..."}
                          </p>
                        )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 p-2 mb-4">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    {order.notes}
                  </p>
                </div>
              )}

              {/* Action Button - Only show if order is ready */}
              {order.status === "ready" && (
                <button
                  onClick={() => handleMarkServed(order._id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Mark as Served</span>
                </button>
              )}

              {/* Status Info */}
              {order.status === "pending" && (
                <div className="text-center text-sm text-yellow-600 dark:text-yellow-400">
                  Waiting for kitchen...
                </div>
              )}
              {order.status === "preparing" && (
                <div className="text-center text-sm text-blue-600 dark:text-blue-400">
                  Kitchen is preparing...
                </div>
              )}
              {order.status === "served" && (
                <div className="text-center text-sm text-purple-600 dark:text-purple-400">
                  Waiting for payment...
                </div>
              )}
              {order.status === "paid" && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
