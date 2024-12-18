import React, { useEffect, useState } from "react";
import axios from "../../services/api/adminApi";
import { Home, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

export default function Coupon() {
  const [coupons, setCouponse] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    name: "",
    code: "",
    discount: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    validFrom: "",
    validTo: "",
    status: true,
  });

  const [errors, setErrors] = useState({});

  const getCoupons = async () => {
    try {
      const responce = await axios.get("/get-coupons");
      setCouponse(responce.data);
    } catch (error) {}
  };

  const validate = () => {
    const newErrors = {};

    if (!newCoupon.name.trim()) newErrors.name = "Coupon name is required.";
    if (!newCoupon.code.trim()) newErrors.code = "Coupon code is required.";
    if (
      !newCoupon.discount ||
      newCoupon.discount <= 0 ||
      newCoupon.discount > 100
    ) {
      newErrors.discount = "Discount must be between 1 and 100.";
    }
    if (!newCoupon.minPurchaseAmount || newCoupon.minPurchaseAmount <= 0) {
      newErrors.minPurchaseAmount =
        "Minimum purchase amount must be greater than 0.";
    }
    if (!newCoupon.maxDiscountAmount || newCoupon.maxDiscountAmount <= 0) {
      newErrors.maxDiscountAmount =
        "Maximum discount limit must be greater than 0.";
    }
    if (!newCoupon.validFrom)
      newErrors.validFrom = "Valid from date is required.";
    if (!newCoupon.validTo) newErrors.validTo = "Valid to date is required.";
    if (
      newCoupon.validFrom &&
      newCoupon.validTo &&
      newCoupon.validFrom > newCoupon.validTo
    ) {
      newErrors.validTo =
        "Valid to date cannot be earlier than valid from date.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post("/add-coupon", newCoupon);
        toast.success("Coupon added successfully!");
        getCoupons();
        // Reset form after successful submission
        setNewCoupon({
          name: "",
          code: "",
          discount: "",
          minPurchaseAmount: "",
          maxDiscountAmount: "",
          validFrom: "",
          validTo: "",
          status: true,
        });
        setErrors({});
      } catch (error) {
        console.error("Error adding coupon:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while adding the coupon."
        );
      }
    }
  };

  const handleTogle = async (id) => {
    try {
      const responce = await axios.patch(`/coupon-status/${id}`);
      toast.success(responce.data.message);
      getCoupons();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const responce = await axios.delete(`/delete-coupon/${id}`);
      toast.success(responce.data.message);
      getCoupons();
    } catch (error) {}
  };

  useEffect(() => {
    getCoupons();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Coupon Management</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Home className="w-4 h-4" />
            <span>Home</span>
            <span>{">"}</span>
            <span>Coupons</span>
          </div>
        </div>
        {/* <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Oct 11,2023 - Nov 11,2022</span>
        </div> */}
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Active Coupons</h2>
          {/* <button>
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button> */}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Coupon Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Coupon Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Min Purchase Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Discount %
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Max Discount Limit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valid To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {coupon.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.minPurchaseAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.discount}%
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.maxDiscountAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {coupon.validTo}
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={coupon.visibility}
                        className="sr-only peer"
                        onChange={() => handleTogle(coupon._id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      {/* <button className="text-blue-600 hover:text-blue-800" aria-label="Edit coupon">
                        <Pencil className="w-4 h-4" />
                      </button> */}
                      <button
                        className="text-red-600 hover:text-red-800"
                        aria-label="Delete coupon"
                        onClick={() => handleDelete(coupon._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Coupon Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Add New Coupon
        </h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          {/* Coupon Name */}
          <div>
            <label
              htmlFor="coupon-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Coupon name
            </label>
            <input
              id="coupon-name"
              type="text"
              name="name"
              value={newCoupon.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Coupon Code & Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="coupon-code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Coupon Code
              </label>
              <input
                id="coupon-code"
                type="text"
                name="code"
                value={newCoupon.code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discount %
              </label>
              <input
                id="discount"
                type="number"
                name="discount"
                value={newCoupon.discount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.discount && (
                <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
              )}
            </div>
          </div>

          {/* Min Purchase & Max Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="min-purchase"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Min purchase amount
              </label>
              <input
                id="min-purchase"
                type="number"
                name="minPurchaseAmount"
                value={newCoupon.minPurchaseAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.minPurchaseAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.minPurchaseAmount}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="max-discount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Max discount limit
              </label>
              <input
                id="max-discount"
                type="number"
                name="maxDiscountAmount"
                value={newCoupon.maxDiscountAmount}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.maxDiscountAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxDiscountAmount}
                </p>
              )}
            </div>
          </div>

          {/* Valid From & Valid To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="valid-from"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Valid from
              </label>
              <input
                id="valid-from"
                type="date"
                name="validFrom"
                value={newCoupon.validFrom}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.validFrom && (
                <p className="text-red-500 text-sm mt-1">{errors.validFrom}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="valid-to"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Valid to
              </label>
              <input
                id="valid-to"
                type="date"
                name="validTo"
                value={newCoupon.validTo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              {errors.validTo && (
                <p className="text-red-500 text-sm mt-1">{errors.validTo}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors mt-6"
          >
            Add
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
