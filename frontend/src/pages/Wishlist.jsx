import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/wishlist");
      setWishlist(response.data.wishlist);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load wishlist"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);

      await api.delete(`/wishlist/${productId}`);

      setWishlist((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to remove product"
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white mt-20">
        Loading wishlist...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-white mt-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchWishlist}
          className="bg-blue-600 px-5 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-2">
        My Wishlist
      </h1>

      <p className="text-gray-400 mb-8">
        {wishlist.length} saved products
      </p>

      {wishlist.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-xl mb-4">
            Your wishlist is empty!
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-pink-600 px-6 py-3 rounded-lg"
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <p className="text-blue-400 text-sm mb-2">
                  {product.category}
                </p>

                <h2 className="text-xl font-semibold mb-3">
                  {product.name}
                </h2>

                <p className="text-2xl font-bold mb-2">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <p className="text-green-400 mb-4">
                  {product.stock > 0
                    ? `${product.stock} units left`
                    : "Out of stock"}
                </p>

                <button
                  onClick={() =>
                    navigate(`/products/${product._id}`)
                  }
                  className="w-full bg-white text-black py-3 rounded-lg mb-3 hover:bg-gray-200"
                >
                  View Details
                </button>

                <button
                  onClick={() => handleRemove(product._id)}
                  disabled={removingId === product._id}
                  className="w-full bg-pink-600 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50"
                >
                  {removingId === product._id
                    ? "Removing..."
                    : "Remove from Wishlist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;