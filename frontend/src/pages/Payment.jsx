
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const paymentOrder = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!paymentOrder?.orderId || !paymentOrder?.razorpayOrderId) {
      navigate("/checkout", { replace: true });
    }
  }, [paymentOrder, navigate]);

  const handlePayment = async () => {
    setError("");

    if (!paymentOrder?.keyId) {
      setError("Payment configuration is missing. Please restart checkout.");
      return;
    }

    if (!window.Razorpay) {
      setError("Razorpay failed to load. Please refresh and try again.");
      return;
    }

    const razorpay = new window.Razorpay({
      key: paymentOrder.keyId,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency || "INR",
      name: "ShopKart",
      description: "ShopKart order payment",
      order_id: paymentOrder.razorpayOrderId,

      handler: async (response) => {
        try {
          setLoading(true);

          const verification = await api.post("/orders/verify-payment", {
            orderId: paymentOrder.orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          await refreshCart();

          navigate("/checkout/success", {
            replace: true,
            state: {
              orderId: paymentOrder.orderId,
              message: verification.data.message,
            },
          });
        } catch (err) {
          setError(
            err.response?.data?.message ||
            "Payment verification failed. Please contact support before retrying."
          );
        } finally {
          setLoading(false);
        }
      },

      modal: {
        ondismiss: () => {
          setError("Payment was cancelled. Your order is still pending.");
        },
      },

      theme: {
        color: "#2563eb",
      },
    });

    razorpay.on("payment.failed", (response) => {
      setError(
        response.error?.description ||
        "Payment failed. Please try again."
      );
    });

    razorpay.open();
  };

  if (!paymentOrder?.orderId || !paymentOrder?.razorpayOrderId) {
    return <p style={{ padding: 30 }}>Opening checkout...</p>;
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1 style={styles.heading}>Complete Your Payment</h1>

        <p style={styles.description}>
          Your ShopKart order is ready. Complete the payment using
          Razorpay Test Mode.
        </p>

        <div style={styles.amount}>
          ₹{(Number(paymentOrder.amount) / 100).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>

        <p style={styles.orderId}>
          Order ID: {paymentOrder.orderId}
        </p>

        {error && (
          <p role="alert" style={styles.error}>
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handlePayment}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Verifying payment..." : "Pay Now"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/cart")}
          style={styles.backButton}
        >
          Back to Cart
        </button>

        <p style={styles.note}>
          Use Razorpay test credentials only. No real payment should
          be made during this lab.
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "70vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Arial, sans-serif",
    background: "#f8fafc",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    padding: 30,
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    boxShadow: "0 8px 28px rgba(0,0,0,.06)",
  },
  heading: {
    fontSize: 26,
    margin: "0 0 12px",
    color: "#111827",
  },
  description: {
    color: "#64748b",
    lineHeight: 1.6,
  },
  amount: {
    fontSize: 32,
    fontWeight: 700,
    margin: "24px 0",
    color: "#111827",
  },
  orderId: {
    fontSize: 12,
    color: "#64748b",
    overflowWrap: "anywhere",
  },
  error: {
    background: "#fff1f2",
    color: "#be123c",
    padding: 12,
    borderRadius: 7,
    lineHeight: 1.5,
  },
  button: {
    width: "100%",
    padding: 14,
    border: 0,
    borderRadius: 7,
    background: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 16,
  },
  backButton: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    border: "1px solid #cbd5e1",
    borderRadius: 7,
    background: "#fff",
    cursor: "pointer",
  },
  note: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 1.5,
    marginTop: 18,
  },
};

export default Payment;
