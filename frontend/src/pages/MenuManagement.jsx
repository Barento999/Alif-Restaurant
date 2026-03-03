import { useState, useEffect } from "react";
import api from "../services/api";

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [menuRes, catRes] = await Promise.all([
      api.get("/menu"),
      api.get("/categories"),
    ]);
    setItems(menuRes.data.data);
    setCategories(catRes.data.data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Menu Management
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {item.name}
            </h3>
            <p className="text-green-600 text-lg">${item.price}</p>
            <p className="text-gray-600 dark:text-gray-300">
              {item.category?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
