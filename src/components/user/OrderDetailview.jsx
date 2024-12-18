import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Loading from "../common/Loading";
import Error from "../common/Error";

function OrderDetailView() {
  const { user } = useSelector((state) => state.user);
  const userId = user.id;
  const navigate = useNavigate();

  const { id } = useParams();
  const orderId = id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [returnReason, setReturnReason] = useState("");

  // Fetch order details using React Query based on orderId
  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orderDetails", orderId],
    queryFn: async () => {
      const response = await axios.get(
        `/order-details-view/${userId}/${orderId}`
      );
      return response.data;
    },
  });

  // Use QueryClient to access cache and invalidate the query
  const queryClient = useQueryClient();

  // Mutation to handle return
  const { mutate: returnProduct, isLoading: isReturning } = useMutation({
    mutationFn: async ({ productId, reason }) => {
      const response = await axios.put(`/return-order/${userId}/${orderId}`, {
        productId,
        reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orderDetails", orderId]);
      toast.success("Item returned successfully");
      setIsModalOpen(false);
      setReturnReason("");
    },
    onError: (error) => {
      console.error("Error returning product:", error);
    },
  });

  const { mutate: cancelProduct, isLoading: isCancelling } = useMutation({
    mutationFn: async (productId) => {
      const response = await axios.put(`/cancel-order/${userId}/${orderId}`, {
        productId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orderDetails", orderId]);
      toast.success("Item cancelled successfully");
    },
    onError: (error) => {
      console.error("Error cancelling product:", error);
      toast.error("Failed to cancel the item. Please try again.");
    },
  });

  const handleCancelClick = (productId) => {
    cancelProduct(productId);
  };

  const handleReturnClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleSendReturn = () => {
    if (!returnReason.trim()) {
      toast.error("Please provide a reason for return.");
      return;
    }
    returnProduct({ productId: selectedProductId, reason: returnReason });
  };

  const handleDownloadInvoice = async () => {
    const doc = new jsPDF();

    // Title and Company Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("MOCCA", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text("Invoice", 105, 20, { align: "center" });

    // Separator line
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    // Order Details
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Order ID: ${order?._id}`, 10, 35);
    doc.text(
      `Order Date: ${new Date(order?.orderDate).toLocaleDateString()}`,
      10,
      45
    );

    // Customer Details
    doc.text("Customer Details:", 10, 55);
    doc.text(`Name: ${order?.address?.name}`, 10, 65);
    doc.text(
      `Address: ${order?.address?.houseno}, ${order?.address?.street}, ${order?.address?.landmark}, ${order?.address?.town}, ${order?.address?.city}, ${order?.address?.state}, ${order?.address?.pincode}`,
      10,
      75,
      { maxWidth: 180 }
    );

    // Products Section
    let startY = 95;
    doc.setFont("helvetica", "bold");
    doc.text("Products:", 10, startY);

    doc.setFont("helvetica", "normal");
    for (let product of order?.products) {
      startY += 10;

      // Fetch image as Base64
      const imgData = await fetch(product.productId.mainImage)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            })
        );

      const imgX = 10;
      const imgY = startY;
      const imgWidth = 30; // Width of the image
      const imgHeight = 30; // Height of the image
      doc.addImage(imgData, "JPEG", imgX, imgY, imgWidth, imgHeight);

      // Add product details
      const detailsX = imgX + imgWidth + 10; // Start X for details, right of image
      const detailsY = imgY + 5; // Start Y for details
      doc.text(`Name: ${product.productId.productName}`, detailsX, detailsY);
      doc.text(
        `Price: ₹${product.productId.salePrice}`,
        detailsX,
        detailsY + 10
      );
      doc.text(`Quantity: ${product.quantity}`, detailsX, detailsY + 20);

      // Adjust the startY for the next product
      startY += imgHeight + 10; // Leave space after each product
      if (startY > 270) {
        // If the content exceeds the page height, create a new page
        doc.addPage();
        startY = 20; // Reset startY for the new page
      }
    }

    // Total Amount
    startY += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: ₹${order?.totalAmount}`, 10, startY);

    // Save the PDF
    doc.save(`Invoice_${order?._id}.pdf`);
  };

  const handleRetryPayment = async (orderId) => {
    try {
      console.log("1");

      // Fetch the order details from the server using the order ID
      const response = await axios.get(
        `/order-details-view/${userId}/${orderId}`
      );
      const orderDetails = response.data;
      console.log(response.data);

      // Check if the order has a pending payment
      if (orderDetails.paymentStatus !== "Failed") {
        toast.error("This order does not have a failed payment status.");
        return;
      }

      // Create a new Razorpay order for the retry
      const razorpayOrderResponse = await axios.post("/create-razorpay-order", {
        amount: Math.floor(orderDetails.totalAmount),
        currency: "INR",
      });
      console.log("2");

      const { order } = razorpayOrderResponse.data;
      console.log(order);

      const razorpayOptions = {
        key: "rzp_test_fVyWQT9oTgFtNj", // Replace with your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: "MOCCA",
        description: "Order Payment Retry",
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify the payment
            const paymentVerificationResponse = await axios.post(
              "/verify-razorpay-payment",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }
            );

            if (paymentVerificationResponse.data.success) {
              // Update order status to "Completed"
              await axios.post("/update-order-status", {
                orderId: orderDetails._id,
                paymentStatus: "Completed",
              });
              toast.success(
                'Payment successful. Order status updated to "Completed".'
              );
            } else {
              throw new Error("Payment verification failed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: orderDetails.address.name,
          // email: orderDetails.user.email,
          contact: orderDetails.address.phone,
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpayInstance = new window.Razorpay(razorpayOptions);
      razorpayInstance.open();

      razorpayInstance.on("payment.failed", async function (response) {
        console.error("Payment failed:", response.error);
        toast.error("Payment failed. Please try again.");
      });
    } catch (error) {
      console.error(
        "Error during retry payment:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to initiate payment retry. Please try again later.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error error={isError} />;
  }

  if (!order) {
    return (
      <p className="text-center text-gray-500">No order details available.</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg text-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Order Details</h2>
        <p className="text-sm text-gray-500">Order ID: {order?._id}</p>
        <p className="text-sm text-gray-500">
          Order Date: {new Date(order?.orderDate).toLocaleDateString()}
        </p>
      </div>

      {/* Modal for return reason */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reason for Return</h3>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              rows="4"
              placeholder="Enter the reason for return"
            />
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={handleSendReturn}
                disabled={isReturning}
              >
                {isReturning ? "Submitting..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Shipping Details</h3>
          {/* Shipping details */}
          <p className="text-sm">
            <strong>Name:</strong> {order?.address?.name}
          </p>
          <p className="text-sm">
            <strong>Address:</strong>{" "}
            {`${order?.address?.houseno}, ${order?.address?.street}, ${order?.address?.landmark}`}
          </p>
          <p className="text-sm">
            <strong>City:</strong>{" "}
            {`${order?.address?.town}, ${order?.address?.city}, ${order?.address?.state}`}
          </p>
          <p className="text-sm">
            <strong>Pincode:</strong> {order?.address?.pincode}
          </p>
          <p className="text-sm">
            <strong>Phone:</strong> {order?.address?.phone}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
          {/* Order summary */}
          <p className="text-sm">
            <strong>Total Amount:</strong> ₹{order?.totalAmount}
          </p>
          <p className="text-sm">
            <strong>Total Items:</strong> {order?.products?.length}
          </p>
          <p className="text-sm">
            <strong>Delivery Status:</strong>{" "}
            <span
              className={`font-bold ${
                order?.orderStatus === "Delivered"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {order?.orderStatus}
            </span>
          </p>
          <p className="text-sm">
            <strong>Payment Method:</strong> {order?.paymentMethod}
          </p>
          <p className="text-sm">
            <strong>Payment Status:</strong>{" "}
            <span
              className={`font-bold ${
                order?.paymentStatus === "Completed"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {order?.paymentStatus}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Ordered Products</h3>
        <div className="space-y-4">
          {order?.products?.map((product) => (
            <div
              key={product.productId._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center">
                <img
                  src={product.productId.mainImage}
                  alt={product.productId.name}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                  onClick={() =>
                    navigate(`/productinfo/${product.productId._id}`)
                  }
                />
                <div>
                  <h4 className="font-semibold">
                    {product.productId.productName}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Quantity: {product.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ₹{product.productId.salePrice}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                {product.status === "Cancelled" ? (
                  <span className="text-sm text-red-500">Item Cancelled</span>
                ) : order?.orderStatus === "Delivered" ? (
                  <div>
                    <button
                      className="text-blue-500 hover:text-blue-700 mb-2"
                      onClick={() => handleReturnClick(product.productId._id)}
                    >
                      Return Item
                    </button>
                  </div>
                ) : order?.paymentStatus === "Failed" ? (
                  <button
                    className="text-orange-500 hover:text-orange-700"
                    onClick={() => handleRetryPayment(order._id)}
                  >
                    Retry Payment
                  </button>
                ) : (
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleCancelClick(product.productId._id)}
                  >
                    Cancel Item
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Button to download invoice - only visible if order is Delivered */}
          {order?.orderStatus === "Delivered" && (
            <button
              className="bg-black text-white px-4 py-2 rounded shadow-md hover:bg-gray-800 transition duration-300"
              onClick={handleDownloadInvoice}
            >
              Download Invoice
            </button>
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default OrderDetailView;
