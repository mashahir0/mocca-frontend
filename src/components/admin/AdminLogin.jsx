import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "../../services/api/adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/login", formData);
      if (response.status === 201) {
        const { adminToken } = response.data;
        localStorage.setItem("adminToken", adminToken);
        navigate("/admin/dashboard");
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        alert(error.response.data.message || "Invalid email or password");
      } else {
        alert("An error occurred during login");
      }
    }
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Hi ! Welcome
          </h1>
          <p className="text-gray-600">
            <span className="font-semibold">MOCCA</span> is waiting for you,
            please enter your details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="email"
                placeholder="Enter your  Email "
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border-b border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* <div className="text-right">
            <a
              href="#"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Forgot Password ?
            </a>
          </div> */}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-black/90 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
