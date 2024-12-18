import React, { useEffect, useState } from "react";
import axios from "../../services/api/adminApi";
import { MoreVertical } from "lucide-react";
import Loading from "../common/Loading";
import Error from "../common/Error";

export default function TopSelling() {
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopSellingData = async () => {
      try {
        const response = await axios.get("/top-selling"); // Adjust your API endpoint here
        const { topProducts, topCategories } = response.data;

        setTopProducts(topProducts);
        setTopCategories(topCategories);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching top selling data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchTopSellingData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="space-y-8">
      {/* Top Selling Products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Top Selling Products</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left text-gray-600">Rank</th>
                <th className="pb-3 text-left text-gray-600">Product Name</th>
                <th className="pb-3 text-left text-gray-600">Category</th>
                <th className="pb-3 text-right text-gray-600">Sales</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-4">{index + 1}</td>
                  <td className="py-4">{product.productName}</td>
                  <td className="py-4">{product.category}</td>
                  <td className="py-4 text-right">{product.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Selling Categories */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Top Selling Categories</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left text-gray-600">Rank</th>
                <th className="pb-3 text-left text-gray-600">Category Name</th>
                <th className="pb-3 text-right text-gray-600">Sales</th>
              </tr>
            </thead>
            <tbody>
              {topCategories.map((category, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-4">{index + 1}</td>
                  <td className="py-4">{category.categoryName}</td>
                  <td className="py-4 text-right">{category.sales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
