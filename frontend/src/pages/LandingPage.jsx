import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#f5f5f0] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-[#0d5f4e] rounded-full blur-3xl opacity-10 -top-48 -left-48"></div>
        <div className="absolute w-96 h-96 bg-[#d4a843] rounded-full blur-3xl opacity-10 top-1/2 -right-48"></div>
        <div className="absolute w-96 h-96 bg-[#0d5f4e] rounded-full blur-3xl opacity-10 -bottom-48 left-1/3"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#0d5f4e] rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-[#d4a843]"
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
              <div>
                <h1 className="text-2xl font-bold text-[#0d5f4e]">
                  Alif Restaurant
                </h1>
                <p className="text-xs text-[#d4a843] font-medium">
                  Management System
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-[#0d5f4e] text-white rounded-lg font-semibold hover:bg-[#0f7a62] transition-all duration-300 shadow-md hover:shadow-lg">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10">
            <div className="inline-block">
              <span className="px-5 py-2.5 bg-[#0d5f4e]/10 border border-[#0d5f4e]/20 rounded-full text-[#0d5f4e] text-sm font-semibold">
                🍽️ Modern Restaurant Management
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-gray-800 leading-tight">
              Elevate Your
              <span className="block text-[#0d5f4e]">Restaurant</span>
              <span className="block text-[#d4a843]">Experience</span>
            </h1>

            <p className="text-2xl text-gray-600 leading-relaxed max-w-xl">
              Streamline operations, boost efficiency, and delight customers
              with our comprehensive restaurant management system. From orders
              to analytics, we've got you covered.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <button
                onClick={() => navigate("/login")}
                className="px-10 py-5 bg-[#0d5f4e] text-white rounded-xl font-bold text-xl hover:bg-[#0f7a62] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-3">
                Get Started
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button className="px-10 py-5 bg-white border-2 border-[#0d5f4e] text-[#0d5f4e] rounded-xl font-bold text-xl hover:bg-[#0d5f4e] hover:text-white transition-all duration-300 flex items-center gap-3">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl font-black text-[#0d5f4e] mb-3">
                  99.9%
                </div>
                <div className="text-base text-gray-600 font-medium">
                  Uptime
                </div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl font-black text-[#0d5f4e] mb-3">
                  500+
                </div>
                <div className="text-base text-gray-600 font-medium">
                  Restaurants
                </div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl font-black text-[#0d5f4e] mb-3">
                  24/7
                </div>
                <div className="text-base text-gray-600 font-medium">
                  Support
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Restaurant Image */}
          <div className="relative lg:h-[700px]">
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl h-full">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=90"
                alt="Modern Restaurant"
                className="w-full h-full object-cover rounded-2xl"
              />
              {/* Floating Cards */}
              <div className="absolute -bottom-8 -left-8 bg-[#0d5f4e] p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-[#d4a843] rounded-xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">1,247</div>
                    <div className="text-base text-[#8fb8ad] font-medium">
                      Orders Today
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 -right-8 bg-[#d4a843] p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">+32%</div>
                    <div className="text-base text-white/90 font-medium">
                      Revenue Up
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to run a modern restaurant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                title: "Order Management",
                description:
                  "Track and manage orders in real-time with our intuitive interface",
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "POS System",
                description:
                  "Lightning-fast point of sale for seamless transactions",
              },
              {
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "Analytics & Reports",
                description: "Data-driven insights to grow your business",
              },
              {
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                title: "Menu Management",
                description:
                  "Update your menu instantly with beautiful displays",
              },
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Staff Management",
                description:
                  "Manage roles, schedules, and performance effortlessly",
              },
              {
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                title: "Inventory Control",
                description:
                  "Never run out of stock with smart inventory tracking",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-[#f5f5f0] p-8 rounded-2xl border-2 border-transparent hover:border-[#0d5f4e] transition-all duration-300 hover:shadow-xl">
                <div className="w-16 h-16 bg-[#0d5f4e] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#d4a843] transition-all duration-300 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant Showcase */}
      <div className="relative z-10 bg-[#f5f5f0] py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Trusted by Leading Restaurants
            </h2>
            <p className="text-xl text-gray-600">
              From cozy cafes to fine dining establishments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
              "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
              "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
            ].map((img, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <img
                  src={img}
                  alt={`Restaurant ${i + 1}`}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d5f4e] via-transparent to-transparent opacity-60"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden bg-[#0d5f4e] rounded-3xl p-16 text-center shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a843] rounded-full opacity-20 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d4a843] rounded-full opacity-20 -ml-32 -mb-32"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Restaurant?
              </h2>
              <p className="text-xl text-[#8fb8ad] mb-8 max-w-2xl mx-auto">
                Join hundreds of restaurants already using our system to
                streamline operations and boost revenue.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="px-12 py-5 bg-[#d4a843] text-white rounded-xl font-bold text-xl hover:bg-[#c49739] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3">
                Start Free Trial
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <p className="text-[#8fb8ad] mt-6 text-sm">
                No credit card required • 14-day free trial
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-white border-t border-gray-200 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#0d5f4e] rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#d4a843]"
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
              <span className="text-lg font-bold text-[#0d5f4e]">
                Alif Restaurant
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2026 Alif Restaurant. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Contact"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-gray-600 hover:text-[#0d5f4e] transition-colors text-sm font-medium">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
