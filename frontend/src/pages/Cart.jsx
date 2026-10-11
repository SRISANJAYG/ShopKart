
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    cartLoading,
    cartError,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    refreshCart,
  } = useCart();

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await updateQuantity(productId, quantity);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to update quantity."
      );
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to remove product."
      );
    }
  };

  const handleCheckout = () => {
    window.location.href = "/checkout";
  };

  if (cartLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <p className="text-lg">Loading your cart...</p>
      </div>
    );
  }

  if (cartError) {
    return (
      <div className="max-w-6xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-3">
          Unable to load your cart
        </h1>

        <p className="text-red-600 mb-4">{cartError}</p>

        <button
          onClick={refreshCart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  const validCartItems = cartItems.filter(
    (item) => item.product
  );

  if (validCartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-10 text-center">
        <div className="text-6xl mb-4">🛒</div>

        <h1 className="text-3xl font-bold mb-3">
          Your cart is empty
        </h1>

        <p className="text-gray-600 mb-6">
          Looks like you haven't added anything yet.
        </p>

        <button
          onClick={() => (window.location.href = "/home")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        My Cart
      </h1>

      <p className="text-gray-600 mb-6">
        {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {validCartItems.map((item) => {
            const product = item.product;

            return (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-5"
              >
                {/* Product Image */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                    No image
                  </div>
                )}

                {/* Product Details */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 mt-1">
                    ₹{product.price}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Available stock: {product.stock}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-sm font-medium">
                      Quantity:
                    </span>

                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="w-9 h-9 border rounded-lg font-bold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      −
                    </button>

                    <span className="min-w-6 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        handleQuantityChange(
                          product._id,
                          item.quantity + 1
                        )
                      }
                      disabled={item.quantity >= product.stock}
                      className="w-9 h-9 border rounded-lg font-bold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm mt-4"
                  >
                    Remove
                  </button>
                </div>

                {/* Item Total */}
                <div className="sm:text-right">
                  <p className="text-sm text-gray-500">
                    Item total
                  </p>

                  <p className="text-lg font-bold mt-1">
                    ₹
                    {(
                      product.price * item.quantity
                    ).toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <aside className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-5">
            Order Summary
          </h2>

          <div className="flex justify-between mb-4">
            <span className="text-gray-600">
              Total items
            </span>

            <span className="font-medium">
              {totalItems}
            </span>
          </div>

          <div className="flex justify-between mb-4">
            <span className="text-gray-600">
              Subtotal
            </span>

            <span className="font-medium">
              ₹
              {subtotal.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="border-t pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>

            <span>
              ₹
              {subtotal.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Shipping and taxes are not included.
          </p>

          {/* Checkout Button */}
          <button
            onClick={handleCheckout}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Proceed to Checkout
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            Secure checkout with Razorpay Test Mode
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
