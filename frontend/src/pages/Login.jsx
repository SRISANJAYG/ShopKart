import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/users/login", {
        email,
        password,
      });

      navigate("/products");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#080b10] text-white flex items-center justify-center px-6">

      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black font-bold text-xl mb-4">
            S
          </div>

          <h1 className="text-2xl font-bold">
            ShopKart
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Welcome back
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#11161d]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          <div className="mb-7">
            <h2 className="text-xl font-semibold">
              Welcome back
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Sign in to continue shopping
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0b0f14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0b0f14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
            >
              Sign In
            </button>

          </form>

          <div className="text-center mt-7 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-white font-medium cursor-pointer hover:text-blue-400 transition"
              >
                Create account
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

export default Login;