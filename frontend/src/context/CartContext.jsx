
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");

  const refreshCart = async () => {
    try {
      setCartLoading(true);
      setCartError("");

      const response = await api.get("/cart");

      setCartItems(response.data.cart || []);
    } catch (error) {
      setCartError(
        error.response?.data?.message || "Unable to load cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (productId) => {
    const response = await api.post(`/cart/${productId}`);

    await refreshCart();

    return response.data;
  };

  const updateQuantity = async (productId, quantity) => {
    const response = await api.patch(`/cart/${productId}`, {
      quantity,
    });

    await refreshCart();

    return response.data;
  };

  const removeFromCart = async (productId) => {
    const response = await api.delete(`/cart/${productId}`);

    await refreshCart();

    return response.data;
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        cartError,
        totalItems,
        subtotal,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
