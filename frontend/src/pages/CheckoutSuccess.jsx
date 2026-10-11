
import { useLocation, useNavigate } from "react-router-dom";

const styles = {
  page: {
    minHeight: "75vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "#080b10",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 500,
    padding: "36px 28px",
    textAlign: "center",
    background: "#11161d",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16,
    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
  },
  icon: {
    width: 72,
    height: 72,
    margin: "0 auto 20px",
    borderRadius: "50%",
    background: "#14532d",
    color: "#86efac",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 38,
    fontWeight: "bold",
  },
  heading: {
    fontSize: 30,
    color: "#86efac",
    marginBottom: 12,
  },
  text: {
    color: "#9ca3af",
    lineHeight: 1.7,
  },
  order: {
    margin: "22px 0",
    padding: 14,
    background: "#080b10",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    overflowWrap: "anywhere",
    fontSize: 13,
    color: "#d1d5db",
  },
  button: {
    width: "100%",
    padding: 14,
    border: 0,
    borderRadius: 8,
    background: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: 12,
  },
  secondaryButton: {
    width: "100%",
    padding: 13,
    border: "1px solid #374151",
    borderRadius: 8,
    background: "#1f2937",
    color: "#fff",
    cursor: "pointer",
    marginTop: 10,
  },
};

function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, message } = location.state || {};

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.icon}>✓</div>

        <h1 style={styles.heading}>Payment Successful!</h1>

        <p style={styles.text}>
          {message ||
            "Thank you for shopping with ShopKart. Your payment has been verified."}
        </p>

        {orderId && (
          <div style={styles.order}>
            <strong>Order ID</strong>
            <p style={{ marginTop: 8 }}>{orderId}</p>
          </div>
        )}

        <button
          type="button"
          style={styles.button}
          onClick={() => navigate("/products", { replace: true })}
        >
          Continue Shopping →
        </button>

        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => navigate("/home", { replace: true })}
        >
          Go to Home
        </button>
      </section>
    </main>
  );
}

export default CheckoutSuccess;
