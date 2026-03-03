import { useState, useEffect } from "react";
import api from "../services/api";

export default function Reports() {
  const [daily, setDaily] = useState(null);
  const [monthly, setMonthly] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const [dailyRes, monthlyRes] = await Promise.all([
      api.get("/reports/daily"),
      api.get("/reports/monthly"),
    ]);
    setDaily(dailyRes.data.data);
    setMonthly(monthlyRes.data.data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Reports
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Daily Report
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Orders: {daily?.totalOrders || 0}
          </p>
          <p className="text-green-600 text-2xl font-bold">
            ${daily?.revenue?.toFixed(2) || "0.00"}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            Monthly Report
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Orders: {monthly?.totalOrders || 0}
          </p>
          <p className="text-green-600 text-2xl font-bold">
            ${monthly?.revenue?.toFixed(2) || "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
}
