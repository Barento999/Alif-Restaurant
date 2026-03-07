import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function CustomerAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFlip = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/customers/login", loginData);
      if (response.data.success) {
        localStorage.setItem("customerToken", response.data.data.token);
        localStorage.setItem("customer", JSON.stringify(response.data.data));
        navigate("/customer-profile");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !registerData.firstName ||
      !registerData.lastName ||
      !registerData.email ||
      !registerData.password
    ) {
      setError("Please fill in all required fields");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/customers/register", {
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone,
      });
      if (response.data.success) {
        localStorage.setItem("customerToken", response.data.data.token);
        localStorage.setItem("customer", JSON.stringify(response.data.data));
        navigate("/customer-profile");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-1/2 bg-[#f5f5f0] flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {isLogin ? (
            /* Login Form */
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600 mb-8">Sign in to your account</p>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#0d5f4e] focus:outline-none transition-colors bg-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#0d5f4e] focus:outline-none transition-colors bg-white"
                    placeholder="Create a password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0d5f4e] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#0f7a62] transition-all duration-300 disabled:opacity-50">
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={handleFlip}
                    className="text-[#0d5f4e] font-semibold hover:underline">
                    Create Account
                  </button>
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-gray-700">
                  Staff Login
                </Link>
                {" | "}
                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-gray-700">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            /* Register Form */
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Create Account
              </h2>
              <p className="text-gray-600 mb-8">Join Alif Restaurant</p>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#0d5f4e] focus:outline-none transition-colors bg-white"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#0d5f4e] focus:outline-none transition-colors bg-white"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#0d5f4e] focus:outline-none transition-colors bg-white"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#0d5f4e] focus:outline-none transition-colors bg-white"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#0d5f4e] focus:outline-none transition-colors bg-white"
                    placeholder="Create a password"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#0d5f4e] focus:outline-none transition-colors bg-white"
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0d5f4e] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#0f7a62] transition-all duration-300 disabled:opacity-50">
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={handleFlip}
                    className="text-[#0d5f4e] font-semibold hover:underline">
                    Sign In
                  </button>
                </p>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-sm text-gray-500 hover:text-gray-700">
                  Staff Login
                </Link>
                {" | "}
                <Link
                  to="/"
                  className="text-sm text-gray-500 hover:text-gray-700">
                  Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Description */}
      <div className="w-1/2 bg-gradient-to-br from-[#0d5f4e] to-[#0a4a3d] flex items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <div className="flex items-center mb-10">
            <div className="w-16 h-16 bg-[#d4a843] rounded-xl flex items-center justify-center mr-4">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold">Alif Restaurant</h1>
          </div>

          <h2 className="text-3xl font-bold mb-10">World Flavors, One Place</h2>

          <div className="space-y-8">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#d4a843] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Order Anytime</h3>
                <p className="text-white/80">
                  Browse our delicious menu and place orders online 24/7 for
                  dine-in or takeout
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#d4a843] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Track Your Orders
                </h3>
                <p className="text-white/80">
                  Get real-time updates on your order status from kitchen to
                  table
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#d4a843] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Easy Checkout</h3>
                <p className="text-white/80">
                  Quick and secure payment options with saved preferences for
                  faster ordering
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 bg-[#d4a843] rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Special Offers</h3>
                <p className="text-white/80">
                  Get exclusive deals, discounts, and loyalty rewards as a
                  registered member
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
