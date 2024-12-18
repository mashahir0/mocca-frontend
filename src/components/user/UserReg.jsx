import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../services/api/userApi";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserReg() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // clear error on change
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.match(phoneRegex))
      newErrors.phone = "Phone number must be 10 digits";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex))
      newErrors.email = "Invalid email format";

    if (otpSent && !formData.otp) newErrors.otp = "OTP is required";

    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    try {
      const response = await axios.post("/send-otp", { email: formData.email });
      if (response.status === 200) {
        setOtpSent(true);
        setTimer(15); // Start countdown at 15 seconds
        toast.success("OTP sent to your email!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please correct the errors before submitting.");
      return;
    }
    try {
      const otpResponse = await axios.post("/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      if (otpResponse.status === 200) {
        const response = await axios.post("/register", formData);
        if (response.status === 201) {
          navigate("/login");
          toast.success("Registration successful!");
        } else {
          toast.error("User already exists!");
        }
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("OTP verification failed.");
    }
  };

  // Timer countdown effect
  useEffect(() => {
    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId); // Clear interval on component unmount
    } else if (timer === 0 && otpSent) {
      setOtpSent(false); // Reset OTP state when timer finishes
    }
  }, [timer, otpSent]);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">LOOKS LIKE YOU'RE NEW HERE!</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name input */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

        {/* Phone input */}
        <input
          type="text"
          name="phone"
          placeholder="Phone No"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

        {/* Email input and OTP button */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <div className="relative">
          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={timer > 0} // Disable button when timer is active
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
          >
            {otpSent
              ? `Resend OTP ${timer > 0 ? `(${timer}s)` : ""}`
              : "Send OTP"}
          </button>
        </div>
        {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}

        {/* Password and Confirm Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
        >
          Sign Up
        </button>

        {/* <button
          type="button"
          className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <img
            src="/placeholder.svg?height=20&width=20"
            alt="Google logo"
            className="w-5 h-5"
          />
          Register with Google
        </button> */}

        <div className="text-center mt-6">
          <span className="text-gray-600">Have an account? </span>
          <Link
            to="/login"
            className="text-black hover:underline font-semibold"
          >
            Sign In
          </Link>
        </div>

        <ToastContainer />
      </form>
    </div>
  );
}
