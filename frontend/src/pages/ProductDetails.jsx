import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (error) {
        console.log(error);

        setError("Something went wrong while loading the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b10] text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading product...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-[#080b10] text-white flex flex-col items-center justify-center">
        <p className="text-red-400 mb-5">
          {error}
        </p>

        <button
          onClick={() => navigate("/products")}
          className="px-5 py-2 rounded-lg bg-white text-black font-medium"
        >
          Back to Products
        </button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#080b10] text-white pt-24 px-6 pb-12">

      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate("/products")}
          className="text-gray-400 hover:text-white transition mb-8"
        >
          ← Back to Products
        </button>

        {/* Product */}
        <div className="grid md:grid-cols-2 gap-10 bg-[#11161d] border border-white/10 rounded-2xl p-6 md:p-8">

          {/* Image */}
          <div className="bg-[#0b0f14] rounded-xl overflow-hidden h-[450px]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center">

            <p className="text-blue-400 text-sm uppercase tracking-wide">
              {product.category}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-3">
              {product.name}
            </h1>

            <p className="text-gray-400 leading-7 mt-5">
              {product.description}
            </p>

            <p className="text-3xl font-bold mt-7">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            {product.stock > 0 ? (
              <p className="text-green-400 mt-3">
                {product.stock} units available
              </p>
            ) : (
              <p className="text-red-400 mt-3">
                Out of stock
              </p>
            )}

            {/* Add to Cart */}
            <button
              disabled={product.stock === 0}
              className="mt-8 w-full md:w-auto px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;