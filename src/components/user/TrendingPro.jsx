import React, { useEffect, useState } from "react";
import axios from "../../services/api/userApi";
import { useNavigate } from "react-router-dom";
import banner from "../../Images/banner.jpg";

export default function TrendingPro() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get("/top-selling"); // Adjust API path as necessary
        setProducts(response.data.topProducts);
      } catch (error) {
        console.error("Error fetching top selling products:", error);
      }
    };

    fetchTopSellingProducts();
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="w-full">
      <img
        src={banner}
        alt="loading..."
        className="w-full h-auto object-cover"
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Most Selling Products</h2>
          <p className="text-gray-600 text-sm">
            Discover the top 3 most popular products bought by our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              onClick={() => navigate(`/productinfo/${product.id}`)}
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center mb-2">
                  {renderStars(product.averageRating)}
                  <span className="text-gray-600 text-sm ml-1">
                    ({product.averageRating || "0.0"})
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  {product.finalPrice < product.price ? (
                    <>
                      <span className="text-lg font-semibold text-red-600">
                        ₹{product.finalPrice}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold">
                      ₹{product.price}
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Available Sizes:{" "}
                  {product.sizes.length > 0 ? product.sizes.join(", ") : "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
