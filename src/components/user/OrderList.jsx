import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "../../services/api/userApi";
import Loading from "../common/Loading";

export default function OrdersList() {
  const { user } = useSelector((state) => state.user);
  const userId = user.id;
  const navigate = useNavigate();

  // React Query: Fetch orders
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const response = await axios.get(`/order-details/${userId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={isError} />;
  }

  if (!orders.length) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">
          No orders found. Start shopping now!
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white my-20 rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Recent Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          // Calculate total quantity for the order
          const totalQuantity = order.products.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          return (
            <div
              key={order._id}
              className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/order-detail-view/${order._id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium">Order ID: {order._id}</h3>
                  <p className="text-sm text-gray-500">
                    Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    Payment: {order.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Total Products:</span>{" "}
                  {totalQuantity}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Total Amount:</span> ₹
                  {order.totalAmount}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-gray-800">Product Status:</h4>
                <ul className="list-disc pl-5">
                  {order.products.map((product) => (
                    <li key={product._id} className="text-sm text-gray-600">
                      <span className="font-medium">{product.productName}</span>
                      : {product.status}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
