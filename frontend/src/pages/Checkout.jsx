import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [orderData, setOrderData] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    notes: "",
    paymentMethod: "cash",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      navigate("/customer-auth");
      return;
    }

    if (cart.length === 0) {
      navigate("/menu");
      return;
    }

    try {
      const response = await axios.get("/api/customers/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCustomer(response.data.data);
        // Pre-fill phone if available
        if (response.data.data.phone) {
          setOrderData((prev) => ({
            ...prev,
            phone: response.data.data.phone,
          }));
        }
        // Pre-fill address if default exists
        const defaultAddress = response.data.data.addresses?.find(
          (addr) => addr.isDefault,
        );
        if (defaultAddress) {
          setOrderData((prev) => ({
            ...prev,
            street: defaultAddress.street || "",
            city: defaultAddress.city || "",
            state: defaultAddress.state || "",
            zipCode: defaultAddress.zipCode || "",
          }));
        }
      }
    } catch (err) {
      console.error(err);
      navigate("/customer-auth");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (
      !orderData.street ||
      !orderData.city ||
      !orderData.state ||
      !orderData.zipCode ||
      !orderData.phone
    ) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("customerToken");

      // Prepare order items
      const items = cart.map((item) => ({
        menuItem: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));

      const subtotal = getCartTotal();
      const deliveryFee = 5.0;
      const tax = subtotal * 0.1;
      const total = subtotal + deliveryFee + tax;

      const orderPayload = {
        items,
        deliveryAddress: {
          street: orderData.street,
          city: orderData.city,
          state: orderData.state,
          zipCode: orderData.zipCode,
        },
        contactPhone: orderData.phone,
        subtotal,
        deliveryFee,
        tax,
        total,
        notes: orderData.notes,
        paymentMethod: orderData.paymentMethod,
      };

      const response = await axios.post("/api/customers/orders", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          navigate("/customer-profile");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to place order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0d5f4e]"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
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
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll start preparing it right away!
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/menu")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#0d5f4e] mb-4 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Menu
            </button>
            <h1 className="text-4xl font-bold text-gray-800">Checkout</h1>
            <p className="text-gray-600 mt-2">
              Complete your order details below
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Customer Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={`${customer?.firstName} ${customer?.lastName}`}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={customer?.email}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Delivery Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={orderData.street}
                        onChange={(e) =>
                          setOrderData({ ...orderData, street: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={orderData.city}
                          onChange={(e) =>
                            setOrderData({ ...orderData, city: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                          placeholder="New York"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={orderData.state}
                          onChange={(e) =>
                            setOrderData({
                              ...orderData,
                              state: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                          placeholder="NY"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={orderData.zipCode}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                        placeholder="10001"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={orderData.phone}
                        onChange={(e) =>
                          setOrderData({ ...orderData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={orderData.notes}
                        onChange={(e) =>
                          setOrderData({ ...orderData, notes: e.target.value })
                        }
                        rows="3"
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                        placeholder="Any special instructions?"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0d5f4e] transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={orderData.paymentMethod === "cash"}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            paymentMethod: e.target.value,
                          })
                        }
                        className="w-5 h-5 text-[#0d5f4e]"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          Cash on Delivery
                        </p>
                        <p className="text-sm text-gray-600">
                          Pay when you receive your order
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#0d5f4e] transition-colors opacity-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        disabled
                        className="w-5 h-5 text-[#0d5f4e]"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          Credit/Debit Card
                        </p>
                        <p className="text-sm text-gray-600">Coming soon</p>
                      </div>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0d5f4e] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0f7a62] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={
                          item.image ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-[#0d5f4e]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>$5.00</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (10%)</span>
                    <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">
                      Total
                    </span>
                    <span className="text-2xl font-black text-[#0d5f4e]">
                      ${(getCartTotal() * 1.1 + 5).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
