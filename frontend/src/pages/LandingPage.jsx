import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";

export default function LandingPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [featuredDishes, setFeaturedDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchFeaturedDishes();
  }, []);

  const fetchFeaturedDishes = async () => {
    try {
      const response = await axios.get("/api/menu/api/all");
      if (response.data.success) {
        // Get 8 random dishes
        const allDishes = response.data.data;
        const shuffled = allDishes.sort(() => 0.5 - Math.random());
        setFeaturedDishes(shuffled.slice(0, 8));
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
      // Use fallback static dishes if API fails
      setFeaturedDishes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] relative overflow-hidden">
      {/* Decorative Background */}
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0d5f4e]">
                  Alif Restaurant
                </h1>
                <p className="text-xs text-[#d4a843] font-medium">
                  World Flavors, One Place
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#menu"
                className="text-gray-700 hover:text-[#0d5f4e] font-medium transition-colors">
                Menu
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-[#0d5f4e] font-medium transition-colors">
                About
              </a>
              <a
                href="#gallery"
                className="text-gray-700 hover:text-[#0d5f4e] font-medium transition-colors">
                Gallery
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-[#0d5f4e] font-medium transition-colors">
                Contact
              </a>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-[#0d5f4e] text-white rounded-lg font-semibold hover:bg-[#0f7a62] transition-all duration-300 shadow-md hover:shadow-lg">
              Reserve Table
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
                🌍 International Cuisine Excellence
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-gray-800 leading-tight">
              Welcome to
              <span className="block text-[#0d5f4e]">Alif</span>
              <span className="block text-[#d4a843]">Restaurant</span>
            </h1>

            <p className="text-2xl text-gray-600 leading-relaxed max-w-xl">
              Experience flavors from around the world. From authentic Ethiopian
              dishes to Italian classics, Asian delicacies, and American
              favorites - all under one roof.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <button
                onClick={() => navigate("/login")}
                className="px-10 py-5 bg-[#0d5f4e] text-white rounded-xl font-bold text-xl hover:bg-[#0f7a62] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-3">
                View Menu
                <svg
                  className="w-6 h-6"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Book a Table
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-12">
              <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl font-black text-[#0d5f4e] mb-3">
                  15+
                </div>
                <div className="text-base text-gray-600 font-medium">
                  Years Serving
                </div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl font-black text-[#0d5f4e] mb-3">
                  200+
                </div>
                <div className="text-base text-gray-600 font-medium">
                  Dishes
                </div>
              </div>
              <div className="text-center bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-5xl font-black text-[#0d5f4e] mb-3">
                  5★
                </div>
                <div className="text-base text-gray-600 font-medium">
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">Open</div>
                    <div className="text-base text-[#8fb8ad] font-medium">
                      Daily 11AM-11PM
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
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="text-3xl font-black text-white">5.0</div>
                    <div className="text-base text-white/90 font-medium">
                      Customer Rating
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="relative z-10 bg-white py-20" id="about">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Why Choose Alif Restaurant
            </h2>
            <p className="text-xl text-gray-600">
              Experience world-class dining with authentic international flavors
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                title: "Fresh Ingredients",
                description:
                  "We source the finest ingredients daily to ensure every dish is fresh and flavorful",
              },
              {
                icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "International Cuisine",
                description:
                  "Ethiopian, Italian, Asian, American, and Middle Eastern dishes all in one place",
              },
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Expert Chefs",
                description:
                  "Our international team of chefs brings authentic flavors from their homelands",
              },
              {
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                title: "Elegant Atmosphere",
                description:
                  "Modern, comfortable dining space perfect for family gatherings and special occasions",
              },
              {
                icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Fast Service",
                description:
                  "Quick and attentive service ensuring you enjoy your meal without long waits",
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                title: "Great Value",
                description:
                  "Premium quality at reasonable prices with generous portions",
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

      {/* Featured Dishes Section */}
      <div className="relative z-10 bg-[#f5f5f0] py-24" id="menu">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Our Signature Dishes
            </h2>
            <p className="text-xl text-gray-600">
              Explore our most popular international flavors
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0d5f4e]"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="relative overflow-hidden h-64">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-[#d4a843] text-white px-3 py-1 rounded-full text-sm font-bold">
                        {dish.area}
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-sm text-[#0d5f4e] font-semibold">
                        {dish.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3 line-clamp-1">
                        {dish.name}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {dish.description?.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Explore Full Menu Button */}
              <div className="text-center mt-16">
                <button
                  onClick={() => navigate("/menu")}
                  className="px-12 py-5 bg-[#0d5f4e] text-white rounded-xl font-bold text-xl hover:bg-[#0f7a62] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3">
                  Explore Full Menu
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
                <p className="text-gray-600 mt-4">
                  Discover 250+ international dishes from around the world
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="relative z-10 bg-white py-20" id="gallery">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Our Restaurant Gallery
            </h2>
            <p className="text-xl text-gray-600">
              A glimpse into our elegant dining space and culinary artistry
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

      {/* Testimonials Section */}
      <div className="relative z-10 bg-[#f5f5f0] py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from our valued guests
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Food Enthusiast",
                rating: 5,
                comment:
                  "The Ethiopian dishes are absolutely authentic! Best injera I've had outside of Ethiopia. The atmosphere is elegant and the service is impeccable.",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
              },
              {
                name: "Michael Chen",
                role: "Regular Customer",
                rating: 5,
                comment:
                  "Amazing variety of international cuisines. The sushi is fresh, the pasta is perfect, and the lamb chops are to die for. This is my go-to restaurant!",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
              },
              {
                name: "Emma Williams",
                role: "Family Diner",
                rating: 5,
                comment:
                  "Perfect for family gatherings! Everyone can find something they love. The kids enjoyed the burgers while we explored the international menu. Highly recommend!",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-[#d4a843]"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-[#0d5f4e] py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Experience World Flavors?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Book your table now and embark on a culinary journey around the
            world
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => navigate("/login")}
              className="px-12 py-5 bg-[#d4a843] text-white rounded-xl font-bold text-xl hover:bg-[#c49a3a] transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Reserve Your Table
            </button>
            <button className="px-12 py-5 bg-white text-[#0d5f4e] rounded-xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Us Now
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="relative z-10 bg-white py-24" id="contact">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Visit Us Today
            </h2>
            <p className="text-xl text-gray-600">
              We're here to serve you the best international cuisine
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="flex items-start gap-6 bg-[#f5f5f0] p-8 rounded-2xl">
                <div className="w-14 h-14 bg-[#0d5f4e] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Location
                  </h3>
                  <p className="text-gray-600 text-lg">
                    123 Main Street, Downtown
                  </p>
                  <p className="text-gray-600 text-lg">City, State 12345</p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-[#f5f5f0] p-8 rounded-2xl">
                <div className="w-14 h-14 bg-[#0d5f4e] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Phone
                  </h3>
                  <p className="text-gray-600 text-lg">(555) 123-4567</p>
                  <p className="text-gray-600 text-lg">(555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-[#f5f5f0] p-8 rounded-2xl">
                <div className="w-14 h-14 bg-[#0d5f4e] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-7 h-7 text-white"
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
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Hours
                  </h3>
                  <p className="text-gray-600 text-lg">Monday - Sunday</p>
                  <p className="text-gray-600 text-lg">11:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-[#f5f5f0] p-8 rounded-2xl">
                <div className="w-14 h-14 bg-[#0d5f4e] rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Email
                  </h3>
                  <p className="text-gray-600 text-lg">
                    info@alifrestaurant.com
                  </p>
                  <p className="text-gray-600 text-lg">
                    reservations@alifrestaurant.com
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-[#f5f5f0] p-10 rounded-3xl">
              <h3 className="text-3xl font-bold text-gray-800 mb-8">
                Send Us a Message
              </h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Tell us about your reservation or inquiry..."
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors resize-none"></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#0d5f4e] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#0f7a62] transition-all duration-300 shadow-lg hover:shadow-xl">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0d5f4e] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#d4a843] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Alif Restaurant</h3>
              </div>
              <p className="text-white/80 leading-relaxed">
                Experience authentic international cuisine in an elegant
                atmosphere. From Ethiopian to Italian, we bring the world to
                your plate.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#menu"
                    className="text-white/80 hover:text-[#d4a843] transition-colors">
                    Menu
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-white/80 hover:text-[#d4a843] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="text-white/80 hover:text-[#d4a843] transition-colors">
                    Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-white/80 hover:text-[#d4a843] transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-white/80 hover:text-[#d4a843] transition-colors">
                    Staff Login
                  </button>
                </li>
              </ul>
            </div>

            {/* Cuisines */}
            <div>
              <h4 className="text-xl font-bold mb-6">Our Cuisines</h4>
              <ul className="space-y-3">
                <li className="text-white/80">🇪🇹 Ethiopian</li>
                <li className="text-white/80">🇮🇹 Italian</li>
                <li className="text-white/80">🇯🇵 Japanese</li>
                <li className="text-white/80">🇺🇸 American</li>
                <li className="text-white/80">🇪🇸 Spanish</li>
                <li className="text-white/80">🇸🇦 Middle Eastern</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-xl font-bold mb-6">Follow Us</h4>
              <div className="flex gap-4 mb-6">
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#d4a843] transition-all duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#d4a843] transition-all duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#d4a843] transition-all duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
              <p className="text-white/80 text-sm">
                Stay updated with our latest dishes, special offers, and events!
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/80 text-center md:text-left">
                © 2024 Alif Restaurant. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-white/80 hover:text-[#d4a843] transition-colors text-sm">
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-[#d4a843] transition-colors text-sm">
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-white/80 hover:text-[#d4a843] transition-colors text-sm">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
