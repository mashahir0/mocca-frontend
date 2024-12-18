import React, { useEffect, useState } from "react";
import axios from "../../services/api/userApi";
import { Star, StarHalf } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => state.user);
  const Id = user.id;
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(`/get-wishlist/${Id}`);
      setProducts(response.data.products); // Use the updated backend response
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  useEffect(() => {
    fetchWishlist(); // Call fetchWishlist when the component mounts
  }, [Id]);

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    return stars;
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`/remove-from-wishlist/${Id}/${productId}`);
      toast.success("Product removed from wishlist");
      fetchWishlist();
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
      toast.error("Failed to remove product. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {products.length === 0 ? (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Your Wishlist is Empty
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm">
              <img
                onClick={() => navigate(`/productinfo/${product.id}`)}
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover rounded-md mb-4"
              />
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-1">
                  {renderRating(product.averageRating)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-green-600">
                    ₹{product.finalPrice}
                  </span>
                  {product.finalPrice !== product.salePrice && (
                    <span className="line-through text-sm text-gray-500">
                      ₹{product.salePrice}
                    </span>
                  )}
                </div>
                <button
                  className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  onClick={() => handleRemove(product.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {products.length > 0 && (
        <div className="fixed bottom-4 right-4">
          <button
            className="px-6 py-2 bg-black text-white rounded-full hover:bg-black/90 transition-colors"
            onClick={() => navigate("/cart")}
          >
            Go To Cart
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
