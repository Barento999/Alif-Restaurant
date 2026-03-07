import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function CustomerAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register state
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
    setIsFlipping(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setError("");
      setIsFlipping(false);
    }, 300);
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
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
    <div className="min-h-screen bg-gradient-to-br from-[#0d5f4e] via-[#0d5f4e] to-[#0a4a3d] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d4a843] rounded-full blur-3xl opacity-10 -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-[#d4a843] rounded-full blur-3xl opacity-10 -bottom-48 -right-48"></div>
        <div className="absolute w-64 h-64 bg-white rounded-full blur-3xl opacity-5 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-[#d4a843] rounded-2xl flex items-center justify-center shadow-2xl">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Alif Restaurant
          </h1>
          <p className="text-[#8fb8ad] text-lg">
            {isLogin ? "Welcome Back" : "Join Us Today"}
          </p>
        </div>

        {/* Flip Container */}
        <div
          className={`transition-all duration-300 ${
            isFlipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}>
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            {/* Toggle Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => isLogin || handleFlip()}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  isLogin
                    ? "bg-[#0d5f4e] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                Sign In
              </button>
              <button
                onClick={() => !isLogin || handleFlip()}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  !isLogin
                    ? "bg-[#0d5f4e] text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}>
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-red-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="ml-3 text-sm text-red-700 font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Login Form */}
            {isLogin ? (
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800"
                    placeholder="john@example.com"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#0d5f4e] border-gray-300 rounded focus:ring-[#0d5f4e]"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-sm text-[#0d5f4e] hover:text-[#0f7a62] font-semibold">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0d5f4e] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0f7a62] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]">
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800"
                    placeholder="john@example.com"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0d5f4e] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0f7a62] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]">
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {isLogin ? "New to Alif?" : "Already a member?"}
                </span>
              </div>
            </div>

            {/* Switch Form Link */}
            <div className="text-center">
              <button
                onClick={handleFlip}
                className="text-[#0d5f4e] font-semibold hover:text-[#0f7a62] transition-colors">
                {isLogin
                  ? "Create a new account"
                  : "Sign in to existing account"}
              </button>
            </div>

            {/* Staff Login & Home Links */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Are you a staff member?{" "}
                  <Link
                    to="/login"
                    className="text-[#0d5f4e] font-semibold hover:text-[#0f7a62] transition-colors">
                    Staff Login
                  </Link>
                </p>
              </div>
              <div className="text-center">
                <Link
                  to="/"
                  className="text-gray-500 text-sm hover:text-gray-700 transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-white/80 mt-8">
          © 2026 Alif Restaurant. All rights reserved.
        </p>
      </div>
    </div>
  );
}
