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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
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
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-16">
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

      {/* How It Works Section */}
      <div className="relative z-10 bg-[#f5f5f0] py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes with our simple setup process
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=90"
                alt="Restaurant POS System"
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-[#0d5f4e] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Quick Setup
                  </h3>
                  <p className="text-lg text-gray-600">
                    Create your account and configure your restaurant settings
                    in under 5 minutes. No technical knowledge required.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-[#0d5f4e] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Add Your Menu
                  </h3>
                  <p className="text-lg text-gray-600">
                    Import your existing menu or create a new one with our
                    intuitive menu builder. Add photos, prices, and
                    descriptions.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-[#0d5f4e] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Start Taking Orders
                  </h3>
                  <p className="text-lg text-gray-600">
                    Begin accepting orders immediately. Train your staff with
                    our easy-to-use interface and watch your efficiency soar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-[#d4a843] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  4
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Monitor Performance
                  </h3>
                  <p className="text-lg text-gray-600">
                    Track sales, inventory, and staff performance in real-time
                    with comprehensive analytics dashboards.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-[#d4a843] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  5
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    Grow Your Business
                  </h3>
                  <p className="text-lg text-gray-600">
                    Use data-driven insights to optimize operations, reduce
                    costs, and increase revenue month over month.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=90"
                alt="Restaurant Analytics Dashboard"
                className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kitchen Display Section */}
      <div className="relative z-10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="px-4 py-2 bg-[#0d5f4e]/10 border border-[#0d5f4e]/20 rounded-full text-[#0d5f4e] text-sm font-semibold inline-block mb-6">
                Kitchen Display System
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Streamline Your Kitchen Operations
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Real-time order updates keep your kitchen running smoothly.
                Orders appear instantly on kitchen displays, reducing errors and
                improving preparation times.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time order notifications",
                  "Priority-based order queue",
                  "Preparation time tracking",
                  "Order modification alerts",
                  "Multi-station support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-[#0d5f4e] flex-shrink-0"
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
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=90"
                alt="Professional Kitchen"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-black text-[#0d5f4e] mb-2">
                    45%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Faster Service
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Management Section */}
      <div className="relative z-10 bg-[#f5f5f0] py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=90"
                alt="Restaurant Dining Area"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-6 -right-6 bg-[#d4a843] p-6 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-black text-white mb-2">98%</div>
                  <div className="text-sm text-white/90 font-medium">
                    Table Turnover
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="px-4 py-2 bg-[#d4a843]/10 border border-[#d4a843]/20 rounded-full text-[#d4a843] text-sm font-semibold inline-block mb-6">
                Table Management
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Optimize Your Seating & Service
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Manage table assignments, track occupancy, and maximize your
                seating capacity with intelligent table management tools.
              </p>
              <ul className="space-y-4">
                {[
                  "Visual floor plan management",
                  "Real-time table status updates",
                  "Reservation system integration",
                  "Waitlist management",
                  "Server assignment tracking",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-[#d4a843] flex-shrink-0"
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
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by restaurant owners worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Owner, The Golden Fork",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
                text: "This system transformed our operations. We've seen a 40% increase in efficiency and our customers love the faster service.",
              },
              {
                name: "Michael Chen",
                role: "Manager, Spice Garden",
                image:
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
                text: "The analytics features are incredible. We can now make data-driven decisions that have significantly improved our bottom line.",
              },
              {
                name: "Emily Rodriguez",
                role: "Chef & Owner, Bella Cucina",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
                text: "Setup was incredibly easy and the support team is fantastic. Our kitchen runs smoother than ever before.",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-[#f5f5f0] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#d4a843]"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {testimonial.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Management Section */}
      <div className="relative z-10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="px-4 py-2 bg-[#0d5f4e]/10 border border-[#0d5f4e]/20 rounded-full text-[#0d5f4e] text-sm font-semibold inline-block mb-6">
                Smart Inventory
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Never Run Out of Ingredients
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Automated inventory tracking helps you maintain optimal stock
                levels, reduce waste, and ensure you always have what you need.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-[#f5f5f0] p-6 rounded-2xl">
                  <div className="text-3xl font-black text-[#0d5f4e] mb-2">
                    35%
                  </div>
                  <div className="text-sm text-gray-600">Waste Reduction</div>
                </div>
                <div className="bg-[#f5f5f0] p-6 rounded-2xl">
                  <div className="text-3xl font-black text-[#0d5f4e] mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-gray-600">Stock Monitoring</div>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Automatic low-stock alerts",
                  "Supplier order management",
                  "Recipe cost calculation",
                  "Expiration date tracking",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-[#0d5f4e] flex-shrink-0"
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
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=90"
                alt="Restaurant Inventory Storage"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Section */}
      <div className="relative z-10 bg-[#f5f5f0] py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=90"
                alt="Restaurant Payment System"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0d5f4e] rounded-xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-[#d4a843]"
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
                    <div className="text-2xl font-black text-gray-800">
                      Secure
                    </div>
                    <div className="text-sm text-gray-600">Payments</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="px-4 py-2 bg-[#d4a843]/10 border border-[#d4a843]/20 rounded-full text-[#d4a843] text-sm font-semibold inline-block mb-6">
                Payment Processing
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Accept All Payment Methods
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Seamlessly process credit cards, mobile payments, and cash with
                our integrated payment system. Split bills, apply discounts, and
                manage tips effortlessly.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0d5f4e] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Multiple Payment Options
                    </h4>
                    <p className="text-gray-600">
                      Credit/debit cards, mobile wallets, contactless, and cash
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0d5f4e] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Secure Transactions
                    </h4>
                    <p className="text-gray-600">
                      PCI-compliant with end-to-end encryption
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#0d5f4e] rounded-xl flex items-center justify-center flex-shrink-0">
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
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      Instant Processing
                    </h4>
                    <p className="text-gray-600">
                      Fast checkout with automatic receipt generation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff & Team Section */}
      <div className="relative z-10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="px-4 py-2 bg-[#0d5f4e]/10 border border-[#0d5f4e]/20 rounded-full text-[#0d5f4e] text-sm font-semibold inline-block mb-6">
                Team Management
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Empower Your Team
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Manage staff schedules, track performance, and streamline
                communication. Give your team the tools they need to deliver
                exceptional service.
              </p>
              <div className="bg-[#f5f5f0] p-8 rounded-2xl mb-8">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-black text-[#0d5f4e] mb-2">
                      50+
                    </div>
                    <div className="text-sm text-gray-600">Staff Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#0d5f4e] mb-2">
                      5
                    </div>
                    <div className="text-sm text-gray-600">Role Types</div>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-[#0d5f4e] mb-2">
                      100%
                    </div>
                    <div className="text-sm text-gray-600">Accountability</div>
                  </div>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  "Role-based access control",
                  "Shift scheduling & time tracking",
                  "Performance analytics",
                  "Internal messaging system",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <svg
                      className="w-6 h-6 text-[#0d5f4e] flex-shrink-0"
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
                    <span className="text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=90"
                alt="Restaurant Team Working"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Digital Display Section */}
      <div className="relative z-10 bg-[#f5f5f0] py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=90"
                alt="Beautiful Restaurant Food"
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-6 -left-6 bg-[#d4a843] p-6 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <div className="text-3xl font-black text-white mb-2">
                    Digital
                  </div>
                  <div className="text-sm text-white/90 font-medium">Menu</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="px-4 py-2 bg-[#d4a843]/10 border border-[#d4a843]/20 rounded-full text-[#d4a843] text-sm font-semibold inline-block mb-6">
                Digital Menu
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                Showcase Your Culinary Creations
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create stunning digital menus with high-quality photos, detailed
                descriptions, and real-time pricing. Update items instantly
                across all platforms.
              </p>
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-[#d4a843] rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">
                      Visual Menu Builder
                    </h4>
                  </div>
                  <p className="text-gray-600">
                    Drag-and-drop interface with photo uploads
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-[#d4a843] rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">
                      Smart Categories
                    </h4>
                  </div>
                  <p className="text-gray-600">
                    Organize by course, dietary preferences, or popularity
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-[#d4a843] rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">
                      Instant Updates
                    </h4>
                  </div>
                  <p className="text-gray-600">
                    Change prices and availability in real-time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics & Reporting Section */}
      <div className="relative z-10 bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-[#0d5f4e]/10 border border-[#0d5f4e]/20 rounded-full text-[#0d5f4e] text-sm font-semibold inline-block mb-6">
              Business Intelligence
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Make Data-Driven Decisions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive analytics and reporting tools give you deep insights
              into every aspect of your restaurant operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                label: "Sales Reports",
                value: "Real-time",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                label: "Customer Insights",
                value: "Detailed",
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              },
              {
                label: "Inventory Tracking",
                value: "Automated",
                icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
              },
              {
                label: "Performance Metrics",
                value: "Live",
                icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-[#f5f5f0] p-8 rounded-2xl text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-[#0d5f4e] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={stat.icon}
                    />
                  </svg>
                </div>
                <div className="text-2xl font-black text-[#0d5f4e] mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=90"
              alt="Business Analytics Dashboard"
              className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d5f4e]/80 via-transparent to-transparent rounded-3xl flex items-end p-12">
              <div className="text-white">
                <h3 className="text-3xl font-bold mb-4">
                  Powerful Insights at Your Fingertips
                </h3>
                <p className="text-lg text-white/90 max-w-2xl">
                  Track revenue, monitor trends, and identify opportunities for
                  growth with our comprehensive analytics dashboard.
                </p>
              </div>
            </div>
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
