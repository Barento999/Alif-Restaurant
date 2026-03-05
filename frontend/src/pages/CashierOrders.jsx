import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
  addOrderRealtime,
  updateOrderRealtime,
} from "../features/orders/orderSlice";
import { io } from "socket.io-client";

export default function CashierOrders() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const [selectedStatus, setSelectedStatus] = useState("served");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    dispatch(fetchOrders());

    const socket = io("http://localhost:5000");
    socket.on("newOrder", (order) => dispatch(addOrderRealtime(order)));
    socket.on("orderStatusUpdate", (order) =>
      dispatch(updateOrderRealtime(order)),
    );

    return () => socket.disconnect();
  }, [dispatch]);

  const handleMarkPaid = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const confirmPayment = async () => {
    try {
      await dispatch(
        updateOrderStatus({ id: selectedOrder._id, status: "paid" }),
      );
      setShowPaymentModal(false);
      setSelectedOrder(null);
      setPaymentMethod("cash");
      alert("Payment processed successfully!");
    } catch (error) {
      alert("Error processing payment");
    }
  };

  const handlePrintReceipt = (order) => {
    const receiptWindow = window.open("", "_blank");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order.orderNumber}</title>
          <style>
            body { font-family: monospace; padding: 20px; max-width: 400px; }
            h1 { text-align: center; font-size: 24px; }
            .header { text-align: center; margin-bottom: 20px; }
            .line { border-bottom: 1px dashed #000; margin: 10px 0; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { font-weight: bold; font-size: 18px; margin-top: 10px; }
            .footer { text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Alif Restaurant</h1>
            <p>Hararghe, Ethiopia</p>
            <p>Receipt</p>
          </div>
          <div class="line"></div>
          <p><strong>Order #:</strong> ${order.orderNumber}</p>
          <p><strong>Table:</strong> ${order.table?.tableNumber || "N/A"}</p>
          <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
          <div class="line"></div>
          <h3>Items:</h3>
          ${order.items
            ?.map(
              (item) => `
            <div class="item">
              <span>${item.menuItem?.name} x${item.quantity}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `,
            )
            .join("")}
          <div class="line"></div>
          <div class="item">
            <span>Subtotal:</span>
            <span>$${order.subtotal?.toFixed(2)}</span>
          </div>
          <div class="item">
            <span>Tax:</span>
            <span>$${order.tax?.toFixed(2)}</span>
          </div>
          <div class="item total">
            <span>TOTAL:</span>
            <span>$${order.total?.toFixed(2)}</span>
          </div>
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>Please come again</p>
          </div>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
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

  const statusOptions = ["served", "ready", "paid", "all"];

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((o) => o.status === selectedStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Cashier - Payment Processing
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
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
              selectedStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}>
            {status} (
            {status === "all"
              ? orders.length
              : orders.filter((o) => o.status === status).length}
            )
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
                    Waiter:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {order.waiter?.name}
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

              {/* Items List with Images */}
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
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#0d5f4e] dark:text-green-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-green-800 dark:text-green-200">
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {order.status === "served" && (
                  <button
                    onClick={() => handleMarkPaid(order)}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Process Payment</span>
                  </button>
                )}
                {order.status === "paid" && (
                  <button
                    onClick={() => handlePrintReceipt(order)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                    <span>Print Receipt</span>
                  </button>
                )}
              </div>

              {/* Status Info */}
              {order.status === "ready" && (
                <div className="text-center text-sm text-green-600 dark:text-green-400 mt-2">
                  Ready for serving
                </div>
              )}
              {order.status === "served" && (
                <div className="text-center text-sm text-purple-600 dark:text-purple-400 mt-2">
                  Awaiting payment
                </div>
              )}
              {order.status === "paid" && (
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Payment completed
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Process Payment
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Order: {selectedOrder.orderNumber}
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                  Total Amount
                </p>
                <p className="text-4xl font-bold text-green-800 dark:text-green-200">
                  ${selectedOrder.total?.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {["cash", "card", "mobile"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`w-full p-4 rounded-lg border-2 transition-all ${
                        paymentMethod === method
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                          : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                      }`}>
                      <span className="font-semibold text-gray-800 dark:text-white capitalize">
                        {method}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedOrder(null);
                  setPaymentMethod("cash");
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all">
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
