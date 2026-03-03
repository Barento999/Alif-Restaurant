import { useSelector } from "react-redux";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Welcome, {user?.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Today's Orders
          </h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Revenue
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">$0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Active Tables
          </h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
