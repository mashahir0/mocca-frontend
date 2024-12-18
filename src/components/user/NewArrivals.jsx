import React, { useEffect, useState } from "react";
import axios from "../../services/api/userApi";
import { useNavigate } from "react-router-dom";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfferProducts = async () => {
      try {
        const response = await axios.get("/offer-products"); // API endpoint
        setProducts(response.data.products); // Set the fetched products
      } catch (error) {
        console.error("Error fetching offer products:", error);
      }
    };

    fetchOfferProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Special Offers</h2>
        <p className="text-gray-600 text-sm">
          Discover exclusive deals on these products
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
              <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-red-600">
                    ₹{product.offerPrice}
                  </span>
                  <span className="text-sm text-gray-500 line-through ml-2">
                    ₹{product.salePrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
