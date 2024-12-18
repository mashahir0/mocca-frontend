import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <div className="rounded-full bg-green-500 p-3">
              <Check className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Your order is Completed</h1>

          <div className="space-y-2 text-gray-600">
            <p>Thank You for your order. Your order is getting processed</p>
            <p>We will update your order status through mail</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded-full hover:bg-black/90 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
