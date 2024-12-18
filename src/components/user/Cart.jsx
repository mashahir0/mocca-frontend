import React, { useState, useEffect } from "react";
import axios from "../../services/api/userApi";
import { Minus, Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "../common/Loading";
import Error from "../common/Error";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const userId = user.id;

  // Fetch cart details
  const fetchCartData = async () => {
    try {
      const response = await axios.get(`/get-cartdetails/${userId}`);

      setCartItems(response.data.items);
      setTotalAmount(response.data.totalAmount);
      setTotalDiscount(response.data.totalDiscount);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch cart details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, [userId]);

  // Update quantity handler
  const editQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 5) {
      toast.error("Quantity must be between 1 and 5");
      return;
    }

    try {
      const response = await axios.put("/edit-quantity", {
        userId,
        productId,
        size,
        quantity: newQuantity,
      });

      if (response.status === 200) {
        fetchCartData();
        toast.success("Quantity updated successfully");
        setCartItems(response.data.items); // Update local state
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  // Remove item handler
  const removeItem = async (productId, size) => {
    try {
      const response = await axios.delete("/remove-item", {
        data: { userId, productId, size },
      });
      if (response.status === 200) {
        toast.success("Item removed from cart");
        setCartItems((prevItems) =>
          prevItems.filter(
            (item) => item.productId._id !== productId || item.size !== size
          )
        );
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item from cart.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">
          No Products found. Start shopping now!
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
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <div className="max-w-4xl mx-auto my-28 p-4">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="bg-gray-50 rounded-lg p-4 flex items-center gap-4"
          >
            {/* Product Image */}
            <img
              src={item.productId.mainImage}
              alt={item.productId.productName}
              className="w-24 h-24 object-cover rounded-md"
              onClick={() => navigate(`/productinfo/${item.productId._id}`)}
            />

            {/* Product Details */}
            <div className="flex-1">
              <h3 className="font-medium">{item.productId.productName}</h3>
              <p className="text-sm text-gray-600">Size: {item.size}</p>

              {/* Quantity Controls */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm">Quantity:</span>
                <button
                  onClick={() =>
                    editQuantity(
                      item.productId._id,
                      item.size,
                      item.quantity - 1
                    )
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    editQuantity(
                      item.productId._id,
                      item.size,
                      item.quantity + 1
                    )
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={item.quantity >= 5}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="text-lg font-semibold">
              ₹
              {
                item.productId.offerStatus && item.productId.offerPrice
                  ? Math.floor(item.productId.offerPrice) // Show offerPrice if offerStatus is true
                  : Math.floor(item.discountedPrice) ||
                    Math.floor(item.productId.salePrice) // Fallback to discountedPrice or salePrice
              }
              <span className="line-through text-sm text-gray-500">
                ₹{Math.floor(item.productId.salePrice)}{" "}
                {/* Always show original sale price as strikethrough */}
              </span>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeItem(item.productId._id, item.size)}
              className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-black/90"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Empty Cart Message */}
        {cartItems.length === 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="fixed top-4 right-4 mt-14 w-72 bg-white p-4 rounded-lg shadow-md border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="font-medium">
              Sub Total ({cartItems.length} item
              {cartItems.length > 1 ? "s" : ""})
            </div>
            {/* Display total amount */}
            <div className="text-xl font-bold">
              ₹{Math.floor(totalAmount).toFixed(2)}
            </div>
            {totalDiscount > 0 && (
              <div className="text-sm text-green-600">
                You saved ₹{totalDiscount.toFixed(2)} on this order!
              </div>
            )}
          </div>
        </div>
        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-black/90 transition-colors"
          onClick={() =>
            navigate("/place-order-cart", { state: { cartItems, totalAmount } })
          }
        >
          Check Out
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
