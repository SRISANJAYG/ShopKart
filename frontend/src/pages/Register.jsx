import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/users/register", formData);
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080b10] text-white flex items-center justify-center px-6 py-12">

      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full" />

      <div className="relative w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black font-bold text-xl mb-4">
            S
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            ShopKart
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Your shopping journey starts here
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#11161d]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Create your account
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Enter your details to get started
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full bg-[#0b0f14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#0b0f14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#0b0f14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-[#0b0f14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition duration-200"
            >
              Create Account
            </button>

          </form>

          {/* Login */}
          <div className="text-center mt-7 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-white font-medium cursor-pointer hover:text-blue-400 transition"
              >
                Sign in
              </span>
            </p>
          </div>

        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          © 2026 ShopKart. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Register;