import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../common/Loading";

export default function PlaceOrder() {
  const { id, size, quantity } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState(null);
  const [addressErr, setAddressErr] = useState(null);
  const [payError, setPayError] = useState("");
  const [couponList, setCouponList] = useState([]);
  const [discountAmount, setDiscountAmount] = useState(0); // Stores the discount amount
  const [isCouponValid, setIsCouponValid] = useState(true); // Flag for coupon validity

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const userId = user.id;

  // Fetch Coupon Details
  const getCoupon = async () => {
    try {
      const response = await axios.get("/coupon-details");
      setCouponList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch Product and Default Address
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product-info/${id}`);
        setProduct([response.data]);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };

    const fetchDefaultAddress = async () => {
      try {
        const response = await axios.get(`/default-address/${userId}`);
        setAddress(response.data);
      } catch (err) {
        setAddressErr(err.response?.data?.message || "Unable to fetch address");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    fetchDefaultAddress();
    getCoupon();
  }, [id, userId]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  const suntotal =
    product && product.length > 0
      ? product[0].offerStatus && product[0].offerPrice
        ? product[0].offerPrice * quantity
        : product[0].effectivePrice
        ? product[0].effectivePrice * quantity
        : product[0].salePrice * quantity
      : 0;

  const total = suntotal - discountAmount;

  const deliveryFee = 0;
  const gst = 0;

  // Validate Coupon
  const handleApplyCoupon = () => {
    const selectedCoupon = couponList.find(
      (coupon) => coupon.code === promoCode
    );

    if (selectedCoupon) {
      // Calculate Discount
      if (suntotal >= selectedCoupon.minPurchaseAmount) {
        const discount = Math.min(
          (selectedCoupon.discount / 100) * suntotal,
          selectedCoupon.maxDiscountAmount
        );
        setDiscountAmount(discount);
        setIsCouponValid(true);
        toast.success(`Coupon applied! You saved ₹${discount.toFixed(2)}.`);
      } else {
        setIsCouponValid(false);
        toast.error(
          `This coupon requires a minimum purchase of ₹${selectedCoupon.minPurchaseAmount}.`
        );
      }
    } else {
      setIsCouponValid(false);
      toast.error("Invalid coupon code. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error("Please select a delivery address.");
      return;
    }

    if (!paymentMethod) {
      setPayError("Please select a payment method before placing the order.");
      return;
    }

    setPayError("");

    const orderDetails = {
      userId,
      address,
      promoCode,
      discountAmount,
      products: product.map((item) => ({
        productId: item._id,
        productName: item.productName,
        mainImage: item.mainImage,
        size,
        quantity,
        price: item.salePrice,
      })),
      paymentMethod,
      totalAmount: total,
    };

    try {
      if (paymentMethod === "Wallet") {
        // Wallet Payment Flow
        const walletResponse = await axios.post("/wallet-payment", {
          userId,
          totalAmount: total,
        });

        if (walletResponse.data.success) {
          // Place the order after wallet payment
          const orderResponse = await axios.post("/place-order", {
            ...orderDetails,
            paymentStatus: "Completed",
          });
          toast.success(orderResponse.data.message);
          navigate("/order-confirmation");
        } else {
          toast.error(
            walletResponse.data.message || "Insufficient wallet balance."
          );
        }
      } else if (paymentMethod === "Razor Pay") {
        // Razorpay Payment Flow
        const razorpayOrderResponse = await axios.post(
          "/create-razorpay-order",
          {
            amount: Math.floor(total),
            currency: "INR",
          }
        );

        const { order } = razorpayOrderResponse.data;

        const razorpayOptions = {
          key: "rzp_test_fVyWQT9oTgFtNj",
          amount: order.amount,
          currency: order.currency,
          name: "MOCCA",
          description: "Order Payment",
          order_id: order.id,
          handler: async function (response) {
            try {
              const paymentVerificationResponse = await axios.post(
                "/verify-razorpay-payment",
                {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }
              );

              if (paymentVerificationResponse.data.success) {
                const orderResponse = await axios.post("/place-order", {
                  ...orderDetails,
                  paymentStatus: "Completed",
                });
                toast.success(orderResponse.data.message);
                navigate("/order-confirmation");
              } else {
                throw new Error("Payment verification failed.");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              // Call API to update the order status to "Failed"
              await axios.post("/place-order", {
                ...orderDetails,
                paymentStatus: "Failed",
              });
              toast.error(
                'Payment verification failed. Order status updated to "Payment Failed".'
              );
            }
          },
          prefill: {
            name: address.name,
            email: user.email,
            contact: address.phone,
          },
          theme: {
            color: "#F37254",
          },
        };

        const razorpayInstance = new window.Razorpay(razorpayOptions);
        razorpayInstance.open();

        razorpayInstance.on("payment.failed", async function (response) {
          console.error("Payment failed:", response.error);
          // Call API to update the order status to "Failed"
          await axios.post("/place-order", {
            ...orderDetails,
            paymentStatus: "Failed",
          });
          toast.error(
            'Payment failed. Order status updated to "Payment Failed".'
          );
        });
      } else {
        // Cash-on-Delivery or Other Payment Methods
        const orderResponse = await axios.post("/place-order", {
          ...orderDetails,
          paymentStatus: "Pending",
        });
        toast.success(orderResponse.data.message);
        navigate("/order-confirmation");
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data?.message || error.message
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to place the order. Please try again."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {Array.isArray(product) && product.length > 0 ? (
              product.map((item) => (
                <div key={item._id} className="flex items-center gap-4 mb-4">
                  <img
                    src={item.mainImage}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                    onClick={() => navigate(`/productinfo/${item._id}`)}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    {item.offerStatus ? (
                      <p className="text-gray-600">
                        ₹{Math.floor(item.offerPrice)}
                      </p>
                    ) : Math.floor(item.effectivePrice) ? (
                      <p className="text-gray-600">
                        ₹{Math.floor(item.effectivePrice)}
                      </p>
                    ) : (
                      <p className="text-gray-600">₹{item.salePrice}</p>
                    )}
                    <p className="text-gray-600">{size}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    Quantity
                    <span className="w-8 text-center">{quantity}</span>
                  </div>
                </div>
              ))
            ) : (
              <div>No product available</div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {Math.floor(suntotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Items</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>Rs. {gst}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>- Rs. {Math.floor(discountAmount)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>Rs. {Math.floor(total)}</span>
              </div>
            </div>
            <div className="mt-4">
              {/* Promo Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Do you have a promo code?"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className={`flex-1 px-3 py-2 border rounded-md focus:outline-none ${
                    isCouponValid ? "border-gray-300" : "border-red-500"
                  }`}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90"
                >
                  Apply
                </button>
              </div>

              {/* Coupon List */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Available Coupons</h3>
                <ul className="space-y-2">
                  {couponList.map((coupon) => (
                    <li
                      key={coupon._id}
                      className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => setPromoCode(coupon.code)} // Set code in input field
                    >
                      <div>
                        <p className="font-medium">{coupon.name}</p>
                        <p className="text-xs text-gray-600">
                          {`Get ${coupon.discount}% off up to ₹${coupon.maxDiscountAmount} on orders above ₹${coupon.minPurchaseAmount}`}
                        </p>
                      </div>
                      <span className="text-sm text-black">{coupon.code}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Address Section */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            {address ? (
              <div>
                <p>{address.name}</p>
                <p>
                  {address.street}, {address.city}, {address.state} -{" "}
                  {address.zip}
                </p>
                <p>{address.phone}</p>
              </div>
            ) : (
              <p className="text-gray-600">{addressErr}</p>
            )}
            <Link to="/address-managment">
              <button className="mt-4 w-full py-2 border rounded-md hover:bg-gray-50">
                Change Default Address...
              </button>
            </Link>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            <p className="text-gray-600 mb-4">Select any payment method</p>
            <div className="space-y-3">
              {["Razor Pay", "Wallet", "Cash On Delivery"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
            {payError && (
              <p className="text-red-500 text-sm mt-2">{payError}</p>
            )}
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full py-3 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
