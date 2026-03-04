import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMenu } from "../features/menu/menuSlice";
import { createOrder } from "../features/orders/orderSlice";
import api from "../services/api";

export default function POSScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.menu);
  const { user } = useSelector((state) => state.auth);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchMenu());
    loadData();
  }, [dispatch]);

  const loadData = async () => {
    try {
      const [tablesRes, categoriesRes] = await Promise.all([
        api.get("/tables"),
        api.get("/categories"),
      ]);
      setTables(tablesRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find((c) => c.menuItem === item._id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.menuItem === item._id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  const updateQuantity = (menuItem, delta) => {
    setCart(
      cart
        .map((c) => {
          if (c.menuItem === menuItem) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean),
    );
  };

  const removeFromCart = (menuItem) => {
    setCart(cart.filter((c) => c.menuItem !== menuItem));
  };

  const handleSubmit = async () => {
    if (!selectedTable || cart.length === 0) {
      return alert("Please select a table and add items to cart");
    }

    try {
      await dispatch(createOrder({ table: selectedTable, items: cart, notes }));
      setCart([]);
      setSelectedTable("");
      setNotes("");
      alert("Order created successfully!");
      loadData();

      // Navigate to My Orders page if user is a waiter
      if (user?.role === "waiter") {
        navigate("/my-orders");
      }
    } catch (error) {
      alert("Error creating order");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category?._id === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && item.isAvailable;
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Menu Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Menu
          </h2>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
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
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
            {filteredItems.map((item) => (
              <button
                key={item._id}
                onClick={() => addToCart(item)}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 text-left">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                    {item.name}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ${item.price}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.category?.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Current Order
          </h2>

          {/* Table Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Table
            </label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option value="">Choose a table...</option>
              {tables
                .filter((t) => t.status === "available")
                .map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.tableNumber} - Capacity: {t.capacity}
                  </option>
                ))}
            </select>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.menuItem}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ${item.price} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.menuItem, -1)}
                      className="w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 flex items-center justify-center">
                      -
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.menuItem, 1)}
                      className="w-7 h-7 bg-green-500 text-white rounded-full hover:bg-green-600 flex items-center justify-center">
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.menuItem)}
                      className="ml-2 text-red-500 hover:text-red-700">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Notes */}
          <textarea
            placeholder="Order notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
            rows="2"
          />

          {/* Totals */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={!selectedTable || cart.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]">
              Place Order
            </button>
            <button
              onClick={() => setCart([])}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
