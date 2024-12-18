import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axios from "../../services/api/userApi";
import { uploadToCloudinary } from "../../services/cloudinary/Cloudinary";
import { Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../common/Loading";

export default function UpdateProfile() {
  const { user } = useSelector((state) => state?.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const id = user?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDetails", id],
    queryFn: async () => {
      const response = await axios.get(`/user-details/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "", // Store the current or new image URL
  });
  const [imageFile, setImageFile] = useState(null); // Store the selected file
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data?.user) {
      setFormData({
        name: data?.user?.name || "",
        email: data?.user?.email || "",
        phone: data?.user?.phone || "",
        image: data?.user?.profileImage || "", // Initialize with the current avatar URL
      });
    }
  }, [data]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file); // Store the selected image file
      setFormData((prevData) => ({
        ...prevData,
        image: URL.createObjectURL(file), // Show preview immediately
      }));
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsUploading(true);

    try {
      let imageUrl = formData.image; // Use the existing image URL if no new image is selected

      // If a new image file was selected, upload it
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile); // Upload to Cloudinary
      }

      // Send updated data including the new or existing image URL
      const updatedData = {
        ...formData,
        image: imageUrl,
      };

      await axios.put(`/update-profile/${id}`, updatedData);
      toast.success("Profile updated successfully");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message || "Email already exists");
      }
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile");
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phone = formData.phone ? String(formData.phone).trim() : ""; // Ensure phone is treated as a string

    // Validate name
    if (
      !formData.name ||
      typeof formData.name !== "string" ||
      !formData.name.trim()
    ) {
      newErrors.name = "Name is required";
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !formData.email ||
      typeof formData.email !== "string" ||
      !formData.email.trim() ||
      !emailRegex.test(formData.email)
    ) {
      newErrors.email = "Valid email is required";
    }

    // Validate phone
    const phoneRegex = /^\d{10}$/;
    if (!phone || !phoneRegex.test(phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  if (isLoading) return <Loading />;
  if (isError) return <Error error={isError} />;
  if (error) return <Error error={error} />;

  return (
    <>
      <button className="flex items-center ml-10 mt-9 text-white bg-black px-4 py-2 rounded-md hover:bg-black/90 transition-colors mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <Link to="/profile">Back</Link>
      </button>
      <div className="max-w-md mx-auto my-4 p-6">
        <h2 className="text-xl font-semibold text-center mb-6">
          Profile Information
        </h2>
        <div className="flex flex-col items-center mb-6">
          <img
            src={formData.image || "/placeholder.svg?height=100&width=100"}
            alt="User Avatar"
            className="w-24 h-24 rounded-full mb-2"
          />
          {isUploading && <p>Uploading...</p>}
          <label className="flex items-center text-sm text-blue-500 cursor-pointer">
            <Camera className="mr-1 h-4 w-4" />
            Edit image
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
          >
            Update
          </button>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}
