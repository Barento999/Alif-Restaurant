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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payment Processing</h1>
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
        {statusOptions.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-xl font-medium capitalize transition ${
              selectedStatus === status
                ? "bg-[#0d5f4e] text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-[#0d5f4e] hover:bg-gray-50"
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
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
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
                  <span className="text-gray-600">Waiter:</span>
                  <span className="font-semibold text-gray-800">
                    {order.waiter?.name}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-semibold text-gray-800">
                    {order.items?.length || 0}
                  </span>
                </div>
              </div>

              {/* Items List with Images */}
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
                      <p className="text-xs text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0d5f4e]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-green-50 rounded-lg p-2.5 mb-3 border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-green-700 font-medium">
                    Total Amount:
                  </span>
                  <span className="text-xl font-bold text-green-800">
                    ${order.total?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {order.status === "served" && (
                  <button
                    onClick={() => handleMarkPaid(order)}
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
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>Process Payment</span>
                  </button>
                )}
                {order.status === "paid" && (
                  <button
                    onClick={() => handlePrintReceipt(order)}
                    className="w-full bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold hover:border-[#0d5f4e] hover:bg-gray-50 transition flex items-center justify-center space-x-2 text-sm">
                    <svg
                      className="w-4 h-4"
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
                <div className="text-center text-xs text-green-600 mt-2 font-medium">
                  Ready for serving
                </div>
              )}
              {order.status === "served" && (
                <div className="text-center text-xs text-purple-600 mt-2 font-medium">
                  Awaiting payment
                </div>
              )}
              {order.status === "paid" && (
                <div className="text-center text-xs text-gray-600 mt-2 font-medium">
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800">
                Process Payment
              </h2>
              <p className="text-gray-600 mt-1 text-sm">
                Order: {selectedOrder.orderNumber}
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <p className="text-sm text-green-700 mb-1 font-medium">
                  Total Amount
                </p>
                <p className="text-4xl font-bold text-green-800">
                  ${selectedOrder.total?.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {["cash", "card", "mobile"].map((method) => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`w-full p-3 rounded-xl border-2 transition-all ${
                        paymentMethod === method
                          ? "border-[#0d5f4e] bg-[#0d5f4e] bg-opacity-5"
                          : "border-gray-200 hover:border-[#0d5f4e]"
                      }`}>
                      <span className="font-semibold text-gray-800 capitalize">
                        {method}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedOrder(null);
                  setPaymentMethod("cash");
                }}
                className="flex-1 bg-white border border-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 bg-[#0d5f4e] text-white py-3 rounded-xl font-semibold hover:bg-[#0f7a62] transition">
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
