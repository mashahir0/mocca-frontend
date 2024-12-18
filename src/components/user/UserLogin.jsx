import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../services/api/userApi";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slice/UserSlice";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;
    let newErrors = { email: "", password: "" };

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post("/userlogin", formData);
        if (response.status === 200) {
          const { accessToken, refreshToken, user } = response.data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          dispatch(
            setUser({
              user,
              accessToken,
              refreshToken,
            })
          );
          navigate("/home");
        } else {
          alert("Login failed");
        }
      } catch (error) {
        console.error("Error details:", error);
        if (error.response) {
          console.error("Response error:", error.response.data);
          alert(
            `Login failed: ${error.response.data.message || "Unknown error"}`
          );
        } else if (error.request) {
          console.error("Request error:", error.request);
          alert("No response from server");
        } else {
          console.error("Error message:", error.message);
          alert("An unexpected error occurred");
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // const handleGoogleSuccess = async (response) => {
  //   const { credential } = response // credential is the ID token returned by Google
  //   try {
  //     // Send the Google ID token to the backend for validation and user data retrieval
  //     const googleUser = await axios.post('/google-login', { tokenId: credential })

  //     const { accessToken, refreshToken, user } = googleUser.data
  //     localStorage.setItem('accessToken', accessToken)
  //     localStorage.setItem('refreshToken', refreshToken)

  //     dispatch(setUser({
  //       user,
  //       accessToken,
  //       refreshToken
  //     }))
  //     navigate('/home')
  //   } catch (error) {
  //     console.error('Google login error:', error)
  //     toast.error('Failed to login with Google.')
  //   }
  // }

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;
    try {
      const googleUser = await axios.post("/google-login", {
        tokenId: credential,
      });

      const { accessToken, refreshToken, user } = googleUser.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Dispatch user info and tokens to Redux store
      dispatch(
        setUser({
          user,
          accessToken,
          refreshToken,
        })
      );

      // Navigate to home page after successful login
      navigate("/home");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Failed to login with Google.");
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">LOGIN</h1>
        <p className="text-gray-600 text-sm">
          Get access to your Orders, Wishlist and Recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

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

        <div className="text-right">
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
          >
            <Link to="/forgotpass">Forgot password?</Link>
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
        >
          Sign in
        </button>

        {/* Google login button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          useOneTap
          shape="pill"
        />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            className="text-black hover:underline font-semibold"
          >
            <Link to="/register">Sign Up</Link>
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}
