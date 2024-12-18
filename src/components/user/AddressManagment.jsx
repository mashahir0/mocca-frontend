import React, { useEffect, useState } from "react";
import axios from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Plus, Trash2, Star } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../common/Loading";
import Error from "../common/Error";

export default function AddressManagment() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.user); // Get the logged-in user's details
  const userId = user?.id;

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`/get-addresses/${userId}`);
        setAddresses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setError("Failed to fetch addresses.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchAddresses();
    } else {
      setError("User is not logged in.");
      setLoading(false);
    }
  }, [userId]);

  // Delete Address
  const handleDelete = async (addressId) => {
    try {
      await axios.delete(`/delete-address/${addressId}`);
      setAddresses((prev) =>
        prev.filter((address) => address._id !== addressId)
      );
      toast.success("Address deleted successfully!");
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address.");
    }
  };

  // Set Address as Default
  const handleSetDefault = async (addressId) => {
    try {
      await axios.patch(`/set-default-address/${addressId}`, { userId });
      setAddresses((prev) =>
        prev.map((address) => ({
          ...address,
          isDefault: address._id === addressId,
        }))
      );
      toast.success("Address set as default!");
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set address as default.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 my-16 bg-white rounded-lg">
      <Link to="/add-address">
        <button className="w-full flex items-center justify-center px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-6">
          <Plus className="mr-2 h-5 w-5" />
          Add a new address
        </button>
      </Link>
      <h2 className="text-2xl font-semibold text-center mb-8">
        Your Addresses
      </h2>
      {addresses.length == 0 ? (
        <p>No addresses found. Please add one!</p>
      ) : (
        <div className="space-y-6">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="p-4 border rounded-md shadow-sm relative"
            >
              {address.isDefault && (
                <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                  Default
                </span>
              )}
              <h3 className="font-medium text-lg mb-2">{address.name}</h3>
              <p className="text-sm">
                <strong>Mobile:</strong> {address.phone}
              </p>
              <p className="text-sm">
                <strong>Address:</strong> {address.houseNo}, {address.street},{" "}
                {address.town}, {address.city}, {address.state} -{" "}
                {address.pincode}
              </p>
              {address.landmark && (
                <p className="text-sm">
                  <strong>Landmark:</strong> {address.landmark}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address._id)}
                    className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                  >
                    <Star className="h-4 w-4" />
                    <span>Set as Default</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
