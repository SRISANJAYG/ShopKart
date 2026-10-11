
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const KEYBOARD_IMAGE =
  "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=85";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
      <rect width="100%" height="100%" fill="#11161d"/>
      <text x="50%" y="48%" fill="#d1d5db"
        font-family="Arial" font-size="24" text-anchor="middle">
        Image unavailable
      </text>
      <text x="50%" y="58%" fill="#9ca3af"
        font-family="Arial" font-size="15" text-anchor="middle">
        Please check product image URL
      </text>
    </svg>
  `);

const Products = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleAddToWishlist = async (productId) => {
    try {
      setSavingId(productId);

      const response = await api.post(`/wishlist/${productId}`);

      alert(response.data.message || "Product added to wishlist!");
    } catch (error) {
      console.error("Wishlist Error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to save product."
      );
    } finally {
      setSavingId(null);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingId(productId);

      const response = await addToCart(productId);

      alert(response.message || "Product added to cart!");
    } catch (error) {
      console.error("Add to Cart Error:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to add product to cart."
      );
    } finally {
      setAddingId(null);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products", {
          params: {
            search: search || undefined,
            category: category || undefined,
          },
        });

        if (active) {
          setProducts(response.data.products || []);
        }
      } catch (error) {
        console.error("Products Error:", error);

        if (active) {
          setError("Unable to load products. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [search, category, retryCount]);

  return (
    <div className="min-h-screen bg-[#080b10] text-white pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-blue-400 text-sm font-medium mb-2">
            ShopKart
          </p>

          <h1 className="text-3xl font-bold">Discover Products</h1>

          <p className="text-gray-400 mt-2">
            Find something you love.
          </p>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="mt-4 text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Home
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="flex-1 bg-[#11161d] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-blue-500"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="md:w-56 bg-[#11161d] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
          </select>
        </div>

        {error ? (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>

            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-4 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-300 text-lg">No products found.</p>
            <p className="text-gray-500 text-sm mt-2">
              Try changing your search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="group bg-[#11161d] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition duration-300"
              >
                <div className="h-56 bg-[#0d1117] overflow-hidden flex items-center justify-center">
                  <img
                    src={
                      product.name?.toLowerCase().includes("mechanical keyboard")
                        ? KEYBOARD_IMAGE
                        : product.image || FALLBACK_IMAGE
                    }
                    alt={product.name}
                    loading="lazy"
                    onError={(event) => {
                      const image = event.currentTarget;

                      if (
                        product.name?.toLowerCase().includes("mechanical keyboard") &&
                        !image.dataset.fallbackTried
                      ) {
                        image.dataset.fallbackTried = "true";
                        image.src = FALLBACK_IMAGE;
                        return;
                      }

                      image.onerror = null;
                      image.src = FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-5">
                  <p className="text-blue-400 text-xs font-medium uppercase tracking-wide">
                    {product.category}
                  </p>

                  <h2 className="text-lg font-semibold mt-2 line-clamp-2">
                    {product.name}
                  </h2>

                  <p className="text-xl font-bold mt-4">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </p>

                  {product.stock > 0 ? (
                    <p className="text-sm text-green-400 mt-2">
                      {product.stock} units left
                    </p>
                  ) : (
                    <p className="text-sm text-red-400 mt-2">
                      Out of stock
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="w-full mt-5 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(product._id)}
                    disabled={addingId === product._id || product.stock < 1}
                    className="w-full mt-3 py-3 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {addingId === product._id
                      ? "Adding..."
                      : product.stock < 1
                        ? "Out of Stock"
                        : "Add to Cart"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAddToWishlist(product._id)}
                    disabled={savingId === product._id}
                    className="w-full mt-3 py-3 rounded-lg bg-pink-600 text-white text-sm font-semibold hover:bg-pink-700 transition disabled:opacity-50"
                  >
                    {savingId === product._id
                      ? "Saving..."
                      : "♡ Add to Wishlist"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
