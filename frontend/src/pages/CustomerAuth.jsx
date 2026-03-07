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
    <div className="h-screen bg-gradient-to-br from-[#0d5f4e] via-[#0d5f4e] to-[#0a4a3d] flex items-center justify-center py-4 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#d4a843] rounded-full blur-3xl opacity-10 -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-[#d4a843] rounded-full blur-3xl opacity-10 -bottom-48 -right-48"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-[#d4a843] rounded-2xl flex items-center justify-center shadow-2xl">
              <svg
                className="w-10 h-10 text-white"
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
          <h1 className="text-3xl font-bold text-white mb-1">
            Alif Restaurant
          </h1>
          <p className="text-[#8fb8ad] text-base">
            {isLogin ? "Welcome Back" : "Join Us Today"}
          </p>
        </div>

        <div style={{ perspective: "1000px" }}>
          <div
            className="relative transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isLogin ? "rotateY(0deg)" : "rotateY(180deg)",
            }}>
            {/* Login Side */}
            <div
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Description Left */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white">
                  <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
                  <div className="space-y-3">
                    {[
                      {
                        icon: "M5 13l4 4L19 7",
                        title: "Track Your Orders",
                        desc: "View order history and track real-time status",
                      },
                      {
                        icon: "M5 13l4 4L19 7",
                        title: "Quick Checkout",
                        desc: "Save your preferences for faster ordering",
                      },
                      {
                        icon: "M5 13l4 4L19 7",
                        title: "Exclusive Offers",
                        desc: "Get special deals and promotions",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <svg
                          className="w-5 h-5 text-[#d4a843] flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={item.icon}
                          />
                        </svg>
                        <div>
                          <h3 className="font-semibold text-base">
                            {item.title}
                          </h3>
                          <p className="text-white/80 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-white/80 mb-3 text-sm">
                      Don't have an account?
                    </p>
                    <button
                      onClick={handleFlip}
                      className="px-5 py-2.5 bg-[#d4a843] text-white rounded-xl font-semibold hover:bg-[#c49739] transition-all duration-300 shadow-lg text-sm">
                      Create Account
                    </button>
                  </div>
                </div>

                {/* Login Form Right */}
                <div className="bg-white rounded-3xl shadow-2xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                    Sign In
                  </h2>
                  <p className="text-gray-600 mb-4 text-center text-sm">
                    Access your account
                  </p>

                  {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-xl">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800 text-sm"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors text-gray-800 text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 text-[#0d5f4e] border-gray-300 rounded"
                        />
                        <span className="ml-2 text-xs text-gray-600">
                          Remember me
                        </span>
                      </label>
                      <a
                        href="#"
                        className="text-xs text-[#0d5f4e] hover:text-[#0f7a62] font-semibold">
                        Forgot password?
                      </a>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#0d5f4e] text-white py-3 rounded-xl font-bold text-base hover:bg-[#0f7a62] transition-all duration-300 shadow-lg disabled:opacity-50">
                      {loading ? "Signing In..." : "Sign In"}
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-center">
                    <p className="text-xs text-gray-600">
                      Are you a staff member?{" "}
                      <Link
                        to="/login"
                        className="text-[#0d5f4e] font-semibold hover:text-[#0f7a62]">
                        Staff Login
                      </Link>
                    </p>
                    <Link
                      to="/"
                      className="text-gray-500 text-xs hover:text-gray-700 block">
                      ← Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Register Side */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Register Form Left */}
                <div className="bg-white rounded-3xl shadow-2xl p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                    Create Account
                  </h2>
                  <p className="text-gray-600 mb-4 text-center text-sm">
                    Join Alif Restaurant today
                  </p>

                  {error && (
                    <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-xl">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={registerData.firstName}
                          onChange={handleRegisterChange}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none text-gray-800 text-sm"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={registerData.lastName}
                          onChange={handleRegisterChange}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none text-gray-800 text-sm"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none text-gray-800 text-sm"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                        className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none text-gray-800 text-sm"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none text-gray-800 text-sm"
                          placeholder="••••••••"
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                          Confirm *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none text-gray-800 text-sm"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Password must be at least 6 characters
                    </p>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#0d5f4e] text-white py-3 rounded-xl font-bold text-base hover:bg-[#0f7a62] transition-all duration-300 shadow-lg disabled:opacity-50">
                      {loading ? "Creating Account..." : "Create Account"}
                    </button>
                  </form>

                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-center">
                    <p className="text-xs text-gray-600">
                      Are you a staff member?{" "}
                      <Link
                        to="/login"
                        className="text-[#0d5f4e] font-semibold hover:text-[#0f7a62]">
                        Staff Login
                      </Link>
                    </p>
                    <Link
                      to="/"
                      className="text-gray-500 text-xs hover:text-gray-700 block">
                      ← Back to Home
                    </Link>
                  </div>
                </div>

                {/* Description Right */}
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 text-white">
                  <h2 className="text-2xl font-bold mb-4">
                    Join Alif Restaurant
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                        title: "Order Anytime",
                        desc: "Browse menu and place orders 24/7",
                      },
                      {
                        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                        title: "Easy Management",
                        desc: "Manage your profile and order preferences",
                      },
                      {
                        icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                        title: "Secure Payments",
                        desc: "Safe and secure online payment options",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start space-x-3">
                        <svg
                          className="w-5 h-5 text-[#d4a843] flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={item.icon}
                          />
                        </svg>
                        <div>
                          <h3 className="font-semibold text-base">
                            {item.title}
                          </h3>
                          <p className="text-white/80 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-white/80 mb-3 text-sm">
                      Already have an account?
                    </p>
                    <button
                      onClick={handleFlip}
                      className="px-5 py-2.5 bg-[#d4a843] text-white rounded-xl font-semibold hover:bg-[#c49739] transition-all duration-300 shadow-lg text-sm">
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/80 mt-4">
          © 2026 Alif Restaurant. All rights reserved.
        </p>
      </div>
    </div>
  );
}
