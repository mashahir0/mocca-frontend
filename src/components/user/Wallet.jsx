import React, { useState, useEffect } from "react";
import axios from "../../services/api/userApi";
import { useSelector } from "react-redux";
import Loading from "../common/Loading";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const { user } = useSelector((state) => state.user);
  const userId = user.id;

  useEffect(() => {
    // Fetch wallet details
    const fetchWallet = async () => {
      try {
        const response = await axios.get(`/wallet/${userId}`); // Adjust endpoint as needed
        setWallet(response.data);
      } catch (error) {
        console.error("Error fetching wallet details:", error);
      }
    };

    fetchWallet();
  }, []);

  if (!wallet) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Wallet Balance */}
      <div className="border-2 border-black rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">My Balance</h2>
        <div className="text-5xl font-bold text-green-500 text-center mb-6">
          ₹ {Math.floor(wallet.balance)}
        </div>
      </div>

      {/* Wallet History */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Wallet History</h2>
        <div className="space-y-4">
          {wallet.transactions.map((transaction, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <div
                className={`px-6 py-3 text-lg font-semibold ${
                  transaction.type === "credit"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {transaction.type}
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 block mb-1">
                    Date:
                  </span>
                  {new Date(transaction.date).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium text-gray-600 block mb-1">
                    Amount:
                  </span>
                  ₹ {transaction.amount}
                </div>
                <div>
                  <span className="font-medium text-gray-600 block mb-1">
                    Description:
                  </span>
                  {transaction.description || "N/A"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
