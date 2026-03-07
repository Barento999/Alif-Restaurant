import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function ModifyOrderModal({ order, onClose, onSave }) {
  const menuItems = useSelector((state) => state.menu.items);
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Initialize with current order items
    if (order) {
      setItems(
        order.items.map((item) => ({
          menuItem: item.menuItem._id,
          name: item.menuItem.name,
          price: item.price,
          quantity: item.quantity,
          image: item.menuItem.image,
        })),
      );
    }
  }, [order]);

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newItems = [...items];
    newItems[index].quantity = newQuantity;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) {
      alert(
        "Order must have at least one item. Use Cancel instead to remove the order.",
      );
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddItem = (menuItem) => {
    const existingIndex = items.findIndex(
      (item) => item.menuItem === menuItem._id,
    );

    if (existingIndex >= 0) {
      // Increase quantity if item already exists
      const newItems = [...items];
      newItems[existingIndex].quantity += 1;
      setItems(newItems);
    } else {
      // Add new item
      setItems([
        ...items,
        {
          menuItem: menuItem._id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: 1,
          image: menuItem.image,
        },
      ]);
    }
  };

  const handleSave = () => {
    if (items.length === 0) {
      alert("Order must have at least one item");
      return;
    }
    onSave(items);
  };

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = subtotal * 0.1;
    return { subtotal, tax, total: subtotal + tax };
  };

  const { subtotal, tax, total } = calculateTotal();

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0d5f4e] text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Modify Order</h2>
              <p className="text-sm opacity-90">{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition">
              <svg
                className="w-6 h-6"
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Items */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Current Items
              </h3>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center">
                          -
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(index, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-200 rounded-full hover:bg-gray-300 flex items-center justify-center">
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveItem(index)}
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
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-3">
                  Order Summary
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-[#0d5f4e]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Items */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Add Items
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {menuItems
                  .filter((item) => item.available)
                  .map((menuItem) => (
                    <div
                      key={menuItem._id}
                      className="bg-white rounded-lg p-3 border border-gray-200 hover:border-[#0d5f4e] transition cursor-pointer"
                      onClick={() => handleAddItem(menuItem)}>
                      <div className="flex items-center gap-3">
                        {menuItem.image && (
                          <img
                            src={menuItem.image}
                            alt={menuItem.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {menuItem.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            ${menuItem.price.toFixed(2)}
                          </p>
                        </div>
                        <button className="text-[#0d5f4e] hover:bg-[#0d5f4e] hover:text-white rounded-full p-2 transition">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#0d5f4e] text-white rounded-xl font-semibold hover:bg-[#0f7a62] transition">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
