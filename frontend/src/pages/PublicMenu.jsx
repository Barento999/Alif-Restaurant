import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PublicMenu() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [filteredDishes, setFilteredDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const dishesPerPage = 12;

  useEffect(() => {
    fetchAllDishes();
  }, []);

  useEffect(() => {
    filterDishes();
  }, [searchTerm, selectedCategory, dishes]);

  const fetchAllDishes = async () => {
    try {
      const response = await axios.get("/api/menu/api/all");
      if (response.data.success) {
        setDishes(response.data.data);
        setFilteredDishes(response.data.data);
        setCategories(["All", ...response.data.categories]);
      }
    } catch (error) {
      console.error("Error fetching dishes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDishes = () => {
    let filtered = dishes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.area?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((dish) => dish.category === selectedCategory);
    }

    setFilteredDishes(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination
  const indexOfLastDish = currentPage * dishesPerPage;
  const indexOfFirstDish = indexOfLastDish - dishesPerPage;
  const currentDishes = filteredDishes.slice(indexOfFirstDish, indexOfLastDish);
  const totalPages = Math.ceil(filteredDishes.length / dishesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <div className="bg-[#0d5f4e] text-white py-20">
        <div className="container mx-auto px-6">
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </button>
          <h1 className="text-5xl lg:text-6xl font-black mb-4">
            Our Full Menu
          </h1>
          <p className="text-xl text-white/90">
            Explore {dishes.length}+ international dishes from around the world
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search dishes, cuisines, or ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-5 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors"
                />
                <svg
                  className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-[#0d5f4e] focus:outline-none transition-colors">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Showing {currentDishes.length} of {filteredDishes.length} dishes
          </div>
        </div>
      </div>

      {/* Dishes Grid */}
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#0d5f4e]"></div>
          </div>
        ) : currentDishes.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No dishes found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-[#0d5f4e] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {dish.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-[#d4a843] text-white px-3 py-1 rounded-full text-sm font-bold">
                      {dish.area}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                      {dish.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {dish.description?.substring(0, 150)}...
                    </p>
                    {dish.ingredients && dish.ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {dish.ingredients.slice(0, 3).map((ingredient, i) => (
                          <span
                            key={i}
                            className="text-xs bg-[#f5f5f0] text-gray-700 px-2 py-1 rounded-full">
                            {ingredient}
                          </span>
                        ))}
                        {dish.ingredients.length > 3 && (
                          <span className="text-xs bg-[#f5f5f0] text-gray-700 px-2 py-1 rounded-full">
                            +{dish.ingredients.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full bg-[#0d5f4e] text-white py-3 rounded-xl font-semibold hover:bg-[#0f7a62] transition-colors">
                      Order Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 hover:border-[#0d5f4e] hover:text-[#0d5f4e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          currentPage === pageNumber
                            ? "bg-[#0d5f4e] text-white"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-[#0d5f4e] hover:text-[#0d5f4e]"
                        }`}>
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white border-2 border-gray-200 text-gray-700 hover:border-[#0d5f4e] hover:text-[#0d5f4e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
