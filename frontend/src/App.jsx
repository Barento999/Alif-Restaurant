import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import POSScreen from "./pages/POSScreen";
import KitchenScreen from "./pages/KitchenScreen";
import MenuManagement from "./pages/MenuManagement";
import Reports from "./pages/Reports";
import Inventory from "./pages/Inventory";
import TableManagement from "./pages/TableManagement";
import UserManagement from "./pages/UserManagement";
import OrderManagement from "./pages/OrderManagement";
import WaiterOrders from "./pages/WaiterOrders";
import CashierOrders from "./pages/CashierOrders";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import PublicMenu from "./pages/PublicMenu";
import LayoutWithSidebar from "./components/LayoutWithSidebar";

const PrivateRoute = ({ children, roles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<PublicMenu />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <PrivateRoute>
              <LayoutWithSidebar />
            </PrivateRoute>
          }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/pos"
            element={
              <PrivateRoute roles={["manager", "cashier", "waiter"]}>
                <POSScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <PrivateRoute roles={["waiter"]}>
                <WaiterOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <PrivateRoute roles={["cashier"]}>
                <CashierOrders />
              </PrivateRoute>
            }
          />
          <Route
            path="/kitchen"
            element={
              <PrivateRoute roles={["kitchen"]}>
                <KitchenScreen />
              </PrivateRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <PrivateRoute roles={["admin", "manager"]}>
                <MenuManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <PrivateRoute roles={["admin", "manager"]}>
                <Reports />
              </PrivateRoute>
            }
          />
          <Route
            path="/tables"
            element={
              <PrivateRoute roles={["admin", "manager"]}>
                <TableManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute roles={["admin", "manager"]}>
                <Inventory />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute roles={["admin"]}>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute roles={["admin", "manager"]}>
                <OrderManagement />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
