import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../features/menu/menuSlice";
import { createOrder } from "../features/orders/orderSlice";
import api from "../services/api";

export default function POSScreen() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.menu);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    dispatch(fetchMenu());
    api.get("/tables").then((res) => setTables(res.data.data));
  }, [dispatch]);

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
        { menuItem: item._id, name: item.name, price: item.price, quantity: 1 },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTable || cart.length === 0)
      return alert("Select table and add items");
    await dispatch(createOrder({ table: selectedTable, items: cart }));
    setCart([]);
    setSelectedTable("");
    alert("Order created");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Menu
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow cursor-pointer"
              onClick={() => addToCart(item)}>
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {item.name}
              </h3>
              <p className="text-green-600">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Order
        </h2>
        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white">
          <option value="">Select Table</option>
          {tables
            .filter((t) => t.status === "available")
            .map((t) => (
              <option key={t._id} value={t._id}>
                {t.tableNumber}
              </option>
            ))}
        </select>
        <div className="space-y-2 mb-4">
          {cart.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-gray-800 dark:text-white">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full mt-4 bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
