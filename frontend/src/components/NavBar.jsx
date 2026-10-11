
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      alert(error.response?.data?.message || "Unable to logout");
    }
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold text-blue-400">
          ShopKart
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/home" className="hover:text-blue-400">
            Home
          </Link>

          <Link to="/cart" className="hover:text-blue-400">
            Cart ({totalItems})
          </Link>

          <Link to="/wishlist" className="hover:text-blue-400">
            Wishlist
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
