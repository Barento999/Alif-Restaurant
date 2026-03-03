import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4 items-center">
              <Link
                to="/dashboard"
                className="text-gray-800 dark:text-white hover:text-blue-600">
                Dashboard
              </Link>
              {["admin", "manager", "cashier", "waiter"].includes(
                user?.role,
              ) && (
                <Link
                  to="/pos"
                  className="text-gray-800 dark:text-white hover:text-blue-600">
                  POS
                </Link>
              )}
              {["admin", "kitchen"].includes(user?.role) && (
                <Link
                  to="/kitchen"
                  className="text-gray-800 dark:text-white hover:text-blue-600">
                  Kitchen
                </Link>
              )}
              {["admin", "manager"].includes(user?.role) && (
                <>
                  <Link
                    to="/menu"
                    className="text-gray-800 dark:text-white hover:text-blue-600">
                    Menu
                  </Link>
                  <Link
                    to="/tables"
                    className="text-gray-800 dark:text-white hover:text-blue-600">
                    Tables
                  </Link>
                  <Link
                    to="/inventory"
                    className="text-gray-800 dark:text-white hover:text-blue-600">
                    Inventory
                  </Link>
                  <Link
                    to="/reports"
                    className="text-gray-800 dark:text-white hover:text-blue-600">
                    Reports
                  </Link>
                </>
              )}
              {user?.role === "admin" && (
                <Link
                  to="/users"
                  className="text-gray-800 dark:text-white hover:text-blue-600">
                  Users
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 dark:text-white">
                {user?.name} ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
