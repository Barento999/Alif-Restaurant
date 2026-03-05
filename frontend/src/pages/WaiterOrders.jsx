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
      // Add all new orders (waiters need to see all orders)
      dispatch(addOrderRealtime(order));
    });

    socket.on("orderStatusUpdate", (order) => {
      // Update all orders (waiters need to see status changes)
      dispatch(updateOrderRealtime(order));
    });

    return () => socket.disconnect();
  }, [dispatch, user?.id]);

  // Filter orders that need waiter attention
  // Show orders that are ready to be served or already served (waiting for payment)
  const myOrders = orders.filter((order) => {
    // Show all ready and served orders to all waiters
    if (order.status === "ready" || order.status === "served") {
      return true;
    }
    // For other statuses, only show if assigned to this waiter
    const orderWaiterId =
      order.waiter?._id?.toString() || order.waiter?.toString();
    const currentUserId = user?.id?.toString();
    return orderWaiterId === currentUserId;
  });

  console.log("=== WAITER ORDERS DEBUG ===");
  console.log("Current User:", user);
  console.log("Current User ID:", user?.id);
  console.log("Total Orders:", orders.length);
  console.log("My Orders:", myOrders.length);
  console.log(
    "Ready Orders:",
    orders.filter((o) => o.status === "ready").length,
  );
  console.log(
    "Served Orders:",
    orders.filter((o) => o.status === "served").length,
  );

  const filteredOrders =
    selectedStatus === "all"
      ? myOrders
      : myOrders.filter((o) => o.status === selectedStatus);

  const handleMarkServed = async (orderId) => {
    try {
      await dispatch(
        updateOrderStatus({ id: orderId, status: "served" }),
      ).unwrap();
      // Refresh orders after successful update
      await dispatch(fetchOrders());
    } catch (error) {
      console.error("Error updating order status:", error);
      alert(
        "Error updating order status: " + (error.message || "Unknown error"),
      );
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <button
          onClick={() => dispatch(fetchOrders())}
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

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedStatus("all")}
          className={`px-4 py-2 rounded-xl font-medium transition ${
            selectedStatus === "all"
              ? "bg-[#0d5f4e] text-white"
              : "bg-white border border-gray-200 text-gray-700 hover:border-[#0d5f4e] hover:bg-gray-50"
          }`}>
          All ({myOrders.length})
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
            {status} ({myOrders.filter((o) => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
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
            <p className="text-lg font-medium text-gray-500">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {order.orderNumber}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Table:</span>
                  <span className="font-semibold text-gray-800">
                    {order.table?.tableNumber}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold text-gray-800">
                    {order.items?.length || 0}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-gray-50 rounded-lg p-2 mb-3 max-h-40 overflow-y-auto space-y-1.5">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white p-2 rounded border border-gray-100">
                    {item.menuItem?.image && (
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-gray-800 font-medium truncate">
                          {item.menuItem?.name}
                        </span>
                        <span className="text-xs text-gray-600 ml-2">
                          x{item.quantity}
                        </span>
                      </div>
                      {item.menuItem?.ingredients &&
                        item.menuItem.ingredients.length > 0 && (
                          <p className="text-xs text-gray-500 truncate">
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
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-2 mb-3 rounded">
                  <p className="text-xs text-yellow-800">{order.notes}</p>
                </div>
              )}

              {/* Action Button - Only show if order is ready */}
              {order.status === "ready" && (
                <button
                  onClick={() => handleMarkServed(order._id)}
                  className="w-full bg-[#0d5f4e] text-white py-2.5 rounded-xl font-semibold hover:bg-[#0f7a62] transition flex items-center justify-center space-x-2 text-sm">
                  <svg
                    className="w-4 h-4"
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
                <div className="text-center text-xs text-yellow-600 font-medium">
                  Waiting for kitchen...
                </div>
              )}
              {order.status === "preparing" && (
                <div className="text-center text-xs text-blue-600 font-medium">
                  Kitchen is preparing...
                </div>
              )}
              {order.status === "served" && (
                <div className="text-center text-xs text-purple-600 font-medium">
                  Waiting for payment...
                </div>
              )}
              {order.status === "paid" && (
                <div className="text-center text-xs text-gray-600 font-medium">
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
