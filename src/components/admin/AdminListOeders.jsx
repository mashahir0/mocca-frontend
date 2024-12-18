import React, { useState, useEffect } from "react";
import axios from "../../services/api/adminApi";
import { ChevronLeft, ChevronRight, TagIcon } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../common/Loading";
import Error from "../common/Error";

export default function AdminListOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await axios.get(`/get-allorders?page=${page}&limit=10`);
      setOrders(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleOrderStatusChange = async (orderId) => {
    try {
      await axios.put(`/update-order-status/${orderId}`, {
        orderStatus: newStatus,
      });
      toast.success("Order status updated successfully");
      setIsModalOpen(false); // Close modal after success
      fetchOrders(currentPage); // Re-fetch orders
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  const handleEditClick = (order) => {
    setOrderToEdit(order);
    setNewStatus(order.orderStatus); // Pre-set the status to current status
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Manage Orders</h1>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto text-sm text-gray-700">
          <thead className="bg-gray-100 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Order No</th>
              <th className="px-6 py-3">Ordered By</th>
              <th className="px-6 py-3">Order Date</th>
              <th className="px-6 py-3">Total Amount</th>
              <th className="px-6 py-3">Payment Status</th>
              <th className="px-6 py-3">Order Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{order._id}</td>
                <td className="px-6 py-4">{order.userId?.name || "Guest"}</td>
                <td className="px-6 py-4">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">₹{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      order.orderStatus === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEditClick(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Modal for Editing Order */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>

            {/* Shipping Address */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-800">
                Shipping Address:
              </h4>
              <p className="text-sm mt-2">
                <strong>Name:</strong> {orderToEdit.address.name}
                <br />
                <strong>House No:</strong> {orderToEdit.address.houseno}
                <br />
                <strong>Street:</strong> {orderToEdit.address.street}
                <br />
                <strong>Landmark:</strong> {orderToEdit.address.landmark}
                <br />
                <strong>Town:</strong> {orderToEdit.address.town},{" "}
                {orderToEdit.address.city}
                <br />
                <strong>State:</strong> {orderToEdit.address.state}
                <br />
                <strong>Pincode:</strong> {orderToEdit.address.pincode}
                <br />
                <strong>Phone:</strong> {orderToEdit.address.phone}
              </p>
            </div>
            {/* return reason*/}
            <div className="mb-4">
              <p className="text-sm mt-2">
                <strong>Return Reasons:</strong>
              </p>
              {orderToEdit.products.map((product, index) => (
                <div key={index} className="mt-1">
                  <p className="text-sm">
                    <strong>Product:</strong> {product.productName}
                  </p>
                  <p className="text-sm">
                    <strong>Reason:</strong>{" "}
                    {product.returnReason || "No return reason provided."}
                  </p>
                </div>
              ))}
            </div>

            {/* Products List */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-800">Products:</h4>
              <ul className="mt-2 space-y-4">
                {orderToEdit.products.map((product) => (
                  <li
                    key={product.productId}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={product.mainImage}
                      alt={product.productName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-grow">
                      <span className="font-medium">{product.productName}</span>
                      <span className="block text-gray-600 text-sm">
                        Size: {product.size}
                      </span>
                    </div>
                    <span className="text-sm">
                      ₹{product.price} x {product.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Payment Status */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-gray-800">
                Payment Status:
              </h4>
              <span
                className={`inline-block px-2 py-1 text-sm font-semibold rounded-full ${
                  orderToEdit.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {orderToEdit.paymentStatus}
              </span>
            </div>

            {/* Update Status */}
            <div className="mb-4">
              <label htmlFor="orderStatus" className="text-sm font-medium">
                Update Order Status:
              </label>
              <select
                id="orderStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => handleOrderStatusChange(orderToEdit._id)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
              >
                Save
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 text-sm rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
