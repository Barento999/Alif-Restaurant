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
    dispatch(fetchOrders("pending,preparing"));

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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Kitchen Orders
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {order.orderNumber}
              </h3>
              <span
                className={`px-3 py-1 rounded text-white ${order.status === "pending" ? "bg-yellow-500" : "bg-blue-500"}`}>
                {order.status}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Table: {order.table?.tableNumber}
            </p>
            <div className="space-y-2 mb-4">
              {order.items?.map((item, i) => (
                <div key={i} className="text-gray-800 dark:text-white">
                  {item.quantity}x {item.menuItem?.name}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {order.status === "pending" && (
                <button
                  onClick={() => handleStatusChange(order._id, "preparing")}
                  className="flex-1 bg-blue-600 text-white p-2 rounded">
                  Start
                </button>
              )}
              {order.status === "preparing" && (
                <button
                  onClick={() => handleStatusChange(order._id, "ready")}
                  className="flex-1 bg-green-600 text-white p-2 rounded">
                  Ready
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
