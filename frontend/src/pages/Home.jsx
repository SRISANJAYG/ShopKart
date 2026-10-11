
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const getUser = async () => {
      try {
        const response = await api.get("/users/me");

        if (active) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Unable to load user:", error);

        if (active) {
          navigate("/login", { replace: true });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    getUser();

    return () => {
      active = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b10] text-white flex items-center justify-center">
        <p className="text-gray-400">Loading your account...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080b10] text-white pb-12">
      <section className="pt-28 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="bg-gradient-to-br from-[#151b24] to-[#0e131a] border border-white/10 rounded-2xl p-8 md:p-12">
            <p className="text-blue-400 text-sm font-medium mb-3">
              Welcome back 👋
            </p>

            <h1 className="text-3xl md:text-5xl font-bold">
              Hello, {user.fullName}
            </h1>

            <p className="text-gray-400 mt-4 max-w-xl leading-7">
              Discover products you'll love. Find your next favourite
              item and enjoy a simple, secure shopping experience.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-7 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Shop Now →
              </button>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="px-7 py-3 rounded-xl border border-white/15 bg-white/5 text-white font-semibold hover:bg-white/10 transition"
              >
                Explore Products
              </button>
            </div>
          </div>

          {/* Quick shopping links */}
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="text-left bg-[#11161d] border border-white/10 rounded-xl p-5 hover:border-blue-500/50 transition"
            >
              <p className="text-lg font-semibold">🛒 Your Cart</p>
              <p className="text-sm text-gray-400 mt-2">
                Review your items and proceed to checkout.
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/wishlist")}
              className="text-left bg-[#11161d] border border-white/10 rounded-xl p-5 hover:border-pink-500/50 transition"
            >
              <p className="text-lg font-semibold">♡ Your Wishlist</p>
              <p className="text-sm text-gray-400 mt-2">
                Revisit the products you've saved.
              </p>
            </button>
          </div>

          {/* Account information */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">
              Your Account
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-[#11161d] border border-white/10 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Full Name</p>
                <p className="mt-2 font-medium break-words">
                  {user.fullName}
                </p>
              </div>

              <div className="bg-[#11161d] border border-white/10 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Email</p>
                <p className="mt-2 font-medium break-all">
                  {user.email}
                </p>
              </div>

              <div className="bg-[#11161d] border border-white/10 rounded-xl p-6">
                <p className="text-gray-400 text-sm">Phone</p>
                <p className="mt-2 font-medium">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Home;
