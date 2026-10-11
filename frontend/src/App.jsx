
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Wishlist from "./pages/Wishlist";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment.jsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.jsx";

function NotFound() {
  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <p style={styles.code}>404</p>
        <h1 style={styles.heading}>Page Not Found</h1>
        <p style={styles.description}>
          Sorry, this page doesn't exist or may have moved.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.primaryButton}
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            Go Home
          </button>

          <button
            style={styles.secondaryButton}
            onClick={() => {
              window.location.href = "/products";
            }}
          >
            Shop Products
          </button>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <>
              <NavBar />
              <Home />
            </>
          }
        />

        <Route
          path="/products"
          element={
            <>
              <NavBar />
              <Products />
            </>
          }
        />

        <Route
          path="/products/:id"
          element={
            <>
              <NavBar />
              <ProductDetails />
            </>
          }
        />

        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/payment" element={<Payment />} />
        <Route
          path="/checkout/success"
          element={<CheckoutSuccess />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "#080b10",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: 520,
    width: "100%",
    textAlign: "center",
    padding: 36,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 18,
    background: "#11161d",
  },
  code: {
    fontSize: 64,
    fontWeight: 800,
    color: "#60a5fa",
    margin: 0,
  },
  heading: {
    fontSize: 28,
    margin: "12px 0",
  },
  description: {
    color: "#9ca3af",
    lineHeight: 1.7,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 24,
  },
  primaryButton: {
    padding: "12px 20px",
    border: 0,
    borderRadius: 8,
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "12px 20px",
    border: "1px solid #374151",
    borderRadius: 8,
    background: "#1f2937",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default App;
