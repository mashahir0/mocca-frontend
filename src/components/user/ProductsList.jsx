import React, { useState, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/api/userApi";
import { useSearch } from "../../../utils/SearchContext";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../common/Loading";

const fetchProducts = async (
  currentPage,
  activeFilter,
  selectedPriceRanges,
  selectedRatings,
  sortOption,
  searchTerm
) => {
  try {
    // Construct query parameters
    const params = {
      page: currentPage,
      category: activeFilter !== "All" ? activeFilter : undefined, // Include category if it's not 'All'
      price:
        selectedPriceRanges.length > 0
          ? selectedPriceRanges.join(",")
          : undefined, // Join price ranges with comma
      rating:
        selectedRatings.length > 0 ? selectedRatings.join(",") : undefined, // Join ratings with comma
      sort: sortOption || undefined, // Sorting option (e.g., 'price-asc')
      search: searchTerm || undefined,
    };

    // Clean up params by removing undefined values
    const cleanedParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    );

    // Make the API call with the query params
    const response = await axios.get("/get-allproducts", {
      params: cleanedParams,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const ProductsList = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState({});
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState([]);
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const userId = user?.id;
  // if(!userId){
  //   navigate('/login')
  // }

  const { searchTerm } = useSearch();

  const fetchAndSetProducts = async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const data = await fetchProducts(
        currentPage,
        activeFilter,
        selectedPriceRanges,
        selectedRatings,
        sortOption,
        searchTerm
      );
      setProducts(data?.data || []);
      setPagination(data?.pagination || { totalPages: 1 });
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = async () => {
    try {
      const responce = await axios.get("/get-category-user");
      setFilter(responce.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAndSetProducts();
    categories();
  }, [
    currentPage,
    activeFilter,
    selectedPriceRanges,
    selectedRatings,
    sortOption,
    searchTerm,
  ]);

  // const filters = ['All', 'T-Shirt', 'Shirt', 'Bottom Wears'];
  const priceRanges = [
    { label: "All prices", value: "all" },
    { label: "Under Rs. 100", value: "under-100" },
    { label: "Rs. 100 to 500", value: "100-500" },
    { label: "Rs. 500 to Rs 1000", value: "500-1000" },
    { label: "Rs. 1000 to Rs. 2000", value: "1000-2000" },
    { label: "Above Rs. 2000", value: "above-2000" },
  ];

  const sortOptions = [
    { label: "Alphabetical (A-Z)", value: "alphabetical" },
    { label: "Price (Low to High)", value: "price-asc" },
    { label: "Price (High to Low)", value: "price-desc" },
    { label: "Rating (High to Low)", value: "rating-desc" },
    { label: "Rating (Low to High)", value: "rating-asc" },
  ];

  const renderStars = (rating) =>
    [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));

  const toggleWishlist = async (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    try {
      const responce = await axios.post(`/add-wishlist/${userId}/${productId}`);
      toast.success(responce.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <Error error={isError} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold mb-3">Filter by Category</h3>
            <div className="space-y-2">
              {filter.map((filter) => (
                <button
                  key={filter._id}
                  onClick={() => setActiveFilter(filter.category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter.category
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold mb-3">Filter by Price</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label
                  key={range.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(range.value)}
                    onChange={() => {
                      setSelectedPriceRanges((prev) =>
                        prev.includes(range.value)
                          ? prev.filter((v) => v !== range.value)
                          : [...prev, range.value]
                      );
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-semibold mb-3">Filter by Ratings</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => {
                      setSelectedRatings((prev) =>
                        prev.includes(rating)
                          ? prev.filter((r) => r !== rating)
                          : [...prev, rating]
                      );
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="flex">
                    {[...Array(rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <span key={i} className="text-gray-300">
                        ★
                      </span>
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sorting Options */}
          <div>
            <h3 className="font-semibold mb-3">Sort by</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full rounded border-gray-300 px-3 py-2"
            >
              <option value="">None</option>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={product.mainImage?.[0] || "default-image.jpg"}
                      alt={product.productName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onClick={() => navigate(`/productinfo/${product._id}`)}
                    />
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          wishlist[product._id]
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    </button>
                  </div>
                  {/* <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{product.productName}</h3>
                    <div className="flex items-center mb-2">
                      {renderStars(product.averageRating)}
                      <span className="text-gray-600 text-sm ml-1">({product.averageRating || 0})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">₹{product.salePrice}</span>
                      <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => navigate(`/productinfo/${product._id}`)}
                      >
                        View Details
                      </a>
                    </div>
                  </div> */}

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {product.productName}
                    </h3>
                    <div className="flex items-center mb-2">
                      {renderStars(product.averageRating)}
                      <span className="text-gray-600 text-sm ml-1">
                        ({Math.floor(product.averageRating) || 0})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      {product.offerStatus ? (
                        <>
                          <span className="text-sm line-through text-gray-400 mr-2">
                            ₹{Math.floor(product.salePrice)}
                          </span>
                          <span className="text-lg font-semibold text-red-600">
                            ₹{Math.floor(product.offerPrice)}
                          </span>
                        </>
                      ) : product.salePrice !== product.effectivePrice ? (
                        <>
                          <span className="text-sm line-through text-gray-400 mr-2">
                            ₹{Math.floor(product.salePrice)}
                          </span>
                          <span className="text-lg font-semibold text-red-600">
                            ₹{Math.floor(product.effectivePrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold">
                          ₹{Math.floor(product.salePrice)}
                        </span>
                      )}
                      {/* <a
                        href="#"
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => navigate(`/productinfo/${product._id}`)}
                      >
                        View Details
                      </a> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from(
              { length: pagination.totalPages || 1 },
              (_, i) => i + 1
            ).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, pagination.totalPages)
                )
              }
              disabled={currentPage === pagination.totalPages}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductsList;
