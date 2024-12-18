import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../services/api/userApi"; // Import axios for API requests
import { ToastContainer, toast } from "react-toastify";

export default function ForgotPass() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(15);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Clear error message on change
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.otp && otpSent) {
      newErrors.otp = "OTP is required.";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter a valid email to send OTP",
      }));
      return;
    }

    try {
      await axios.post("/send-otp", { email: formData.email });
      setOtpSent(true);
      setIsTimerRunning(true);
      setTimer(15);
      toast.success("OTP sent successfully.");
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrors((prev) => ({
        ...prev,
        email: "Failed to send OTP. Try again.",
      }));
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setErrors((prev) => ({ ...prev, otp: "Enter the OTP to verify." }));
      return;
    }

    try {
      const response = await axios.post("/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      if (
        response.status === 200 &&
        response.data.message === "OTP verified successfully"
      ) {
        setOtpVerified(true);
        toast.success("OTP verified successfully.");
      } else {
        setErrors((prev) => ({
          ...prev,
          otp: response.data.message || "Invalid OTP. Try again.",
        }));
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors((prev) => ({
        ...prev,
        otp: "Failed to verify OTP. Try again.",
      }));
    }
  };

  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }

    if (!otpVerified) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP must be verified before changing the password.",
      }));
      return;
    }

    try {
      const response = await axios.post("/change-newpassword", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        console.log("Password changed successfully.");
        toast.success("Your password has been updated.");
      } else {
        console.error("Failed to change password.");
        toast.error("Failed to change password. Try again later.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Server error. Please try again later.");
    }
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">FORGOT PASSWORD?</h1>
        <p className="text-gray-600 text-sm">
          Enter your email or phone number, and we will send you an OTP to
          change your password.
        </p>
      </div>

      <form className="space-y-4">
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <button
            type="button"
            onClick={handleSendOTP}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
          >
            Send OTP
          </button>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {otpSent && (
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
              onClick={handleVerifyOTP}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-green-600 hover:text-green-800"
            >
              Verify OTP
            </button>
            {errors.otp && (
              <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
            )}
          </div>
        )}

        {otpVerified && (
          <>
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
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

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
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleChangePassword}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
            >
              Change Password
            </button>
          </>
        )}
        {!isAuthenticated ? (
          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <button
              type="button"
              className="text-black hover:underline font-semibold"
            >
              <Link to="/register">Sign Up</Link>
            </button>
          </div>
        ) : null}
      </form>
      <ToastContainer />
    </div>
  );
}
