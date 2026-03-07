import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import notificationSound from "../utils/notificationSound";

export default function OrderNotifications({ orders = [] }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(notificationSound.enabled);
  const [showSettings, setShowSettings] = useState(false);
  const previousReadyOrders = useRef(new Set());

  useEffect(() => {
    // Find orders that just became ready
    const readyOrders = orders.filter(
      (order) =>
        order.status === "ready" &&
        !["paid", "cancelled"].includes(order.status),
    );

    // Check for new ready orders
    readyOrders.forEach((order) => {
      if (!previousReadyOrders.current.has(order._id)) {
        // New order is ready!
        addNotification(order);

        // Play sound based on priority
        if (order.priority === "urgent") {
          notificationSound.playNotification("urgent");
        } else {
          notificationSound.playNotification("ready");
        }
      }
    });

    // Update the set of ready orders
    previousReadyOrders.current = new Set(readyOrders.map((o) => o._id));
  }, [orders]);

  const addNotification = (order) => {
    const notification = {
      id: order._id,
      orderNumber: order.orderNumber,
      tableNumber: order.table?.tableNumber,
      priority: order.priority,
      timestamp: Date.now(),
    };

    setNotifications((prev) => {
      // Avoid duplicates
      if (prev.some((n) => n.id === notification.id)) {
        return prev;
      }
      return [notification, ...prev].slice(0, 5); // Keep max 5 notifications
    });

    // Auto-remove after 10 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 10000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (orderId) => {
    navigate(`/orders/${orderId}`);
    removeNotification(orderId);
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    notificationSound.setEnabled(newState);
  };

  const handleVolumeChange = (e) => {
    const volume = parseFloat(e.target.value);
    notificationSound.setVolume(volume);
  };

  return (
    <>
      {/* Notification Settings Button */}
      <div className="fixed top-20 right-4 z-40">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 rounded-full shadow-lg transition-all ${
            soundEnabled
              ? "bg-[#0d5f4e] text-white hover:bg-[#0f7a62]"
              : "bg-gray-300 text-gray-600 hover:bg-gray-400"
          }`}
          title="Notification Settings">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            {soundEnabled ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            )}
          </svg>
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute top-14 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-64">
            <h3 className="font-bold text-gray-800 mb-3">
              Notification Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Sound Alerts</span>
                <button
                  onClick={toggleSound}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    soundEnabled ? "bg-[#0d5f4e]" : "bg-gray-300"
                  }`}>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      soundEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="text-sm text-gray-700 block mb-1">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue={notificationSound.volume}
                  onChange={handleVolumeChange}
                  disabled={!soundEnabled}
                  className="w-full"
                />
              </div>
              <button
                onClick={() => notificationSound.playNotification("ready")}
                disabled={!soundEnabled}
                className="w-full px-3 py-2 bg-[#0d5f4e] text-white rounded-lg hover:bg-[#0f7a62] text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
                Test Sound
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Toasts */}
      <div className="fixed top-20 right-20 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            className={`bg-white rounded-xl shadow-2xl border-l-4 p-4 cursor-pointer transform transition-all hover:scale-105 animate-slideIn ${
              notification.priority === "urgent"
                ? "border-red-500 bg-red-50"
                : notification.priority === "high"
                  ? "border-orange-500 bg-orange-50"
                  : "border-green-500"
            }`}>
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.priority === "urgent"
                    ? "bg-red-100 animate-pulse"
                    : notification.priority === "high"
                      ? "bg-orange-100"
                      : "bg-green-100"
                }`}>
                <svg
                  className={`w-6 h-6 ${
                    notification.priority === "urgent"
                      ? "text-red-600"
                      : notification.priority === "high"
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
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
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800">Order Ready!</p>
                  {notification.priority === "urgent" && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-bold rounded animate-pulse">
                      🔥 URGENT
                    </span>
                  )}
                  {notification.priority === "high" && (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-bold rounded">
                      ⚡ HIGH
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">
                    {notification.orderNumber}
                  </span>{" "}
                  - Table {notification.tableNumber}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Click to view order details
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(notification.id);
                }}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
