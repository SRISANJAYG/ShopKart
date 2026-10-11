
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const initialAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  pincode: "",
};

const fieldLabels = {
  fullName: "Full Name",
  phone: "Phone Number",
  addressLine1: "Address",
  city: "City",
  state: "State",
  pincode: "Pincode",
};

const styles = `
.checkout-page {
  max-width: 1100px;
  margin: 30px auto;
  padding: 20px;
  color: #111827;
  font-family: Arial, sans-serif;
}
.checkout-page h1 {
  font-size: 30px;
  margin-bottom: 24px;
}
.checkout-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr;
  gap: 24px;
  align-items: start;
}
.shipping-form, .checkout-summary {
  background: white;
  border: 1px solid #dbe3ef;
  border-radius: 13px;
  padding: 24px;
  box-shadow: 0 5px 20px rgba(0,0,0,.05);
}
.shipping-form h2, .checkout-summary h2 {
  font-size: 19px;
  margin: 0 0 22px;
}
.shipping-form label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}
.shipping-form input, .shipping-form textarea {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 8px;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  font-size: 14px;
  color: #111827;
  background: white;
  outline: none;
}
.shipping-form input:focus, .shipping-form textarea:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37,99,235,.12);
}
.shipping-form textarea {
  min-height: 76px;
  resize: vertical;
}
.checkout-submit {
  width: 100%;
  border: 0;
  border-radius: 7px;
  padding: 14px;
  background: #2563eb;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}
.checkout-submit:disabled {
  opacity: .6;
  cursor: not-allowed;
}
.checkout-error {
  background: #fff1f2;
  color: #be123c;
  border-radius: 7px;
  padding: 12px;
  font-size: 13px;
  margin-bottom: 16px;
  overflow-wrap: anywhere;
}
.checkout-item, .checkout-total {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  font-size: 13px;
}
.checkout-item span:first-child {
  overflow-wrap: anywhere;
}
.checkout-summary hr {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 12px 0;
}
.checkout-total {
  font-size: 19px;
  font-weight: 700;
}
.checkout-note {
  font-size: 12px;
  line-height: 1.6;
  color: #64748b;
}
.checkout-loading {
  padding: 30px;
  text-align: center;
}
@media (max-width: 750px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
  .checkout-page {
    padding: 14px;
    margin: 12px auto;
  }
  .shipping-form, .checkout-summary {
    padding: 18px;
  }
}
`;

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, subtotal, cartLoading } = useCart();

  const [address, setAddress] = useState(initialAddress);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartLoading, cartItems.length, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddress((previousAddress) => ({
      ...previousAddress,
      [name]: value,
    }));

    setError("");
  };

  const validateAddress = (formAddress) => {
    for (const field of Object.keys(initialAddress)) {
      const value = formAddress[field];

      if (typeof value !== "string" || !value.trim()) {
        return `${fieldLabels[field]} is required.`;
      }
    }

    if (!/^[6-9]\d{9}$/.test(formAddress.phone)) {
      return "Enter a valid 10-digit Indian mobile number.";
    }

    if (!/^\d{6}$/.test(formAddress.pincode)) {
      return "Enter a valid 6-digit pincode.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);

    const formAddress = {
      fullName: String(formData.get("fullName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      addressLine1: String(formData.get("addressLine1") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      state: String(formData.get("state") || "").trim(),
      pincode: String(formData.get("pincode") || "").trim(),
    };

    console.log(
      "Address being sent:",
      JSON.stringify(formAddress, null, 2)
    );

    const validationError = validateAddress(formAddress);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/orders/create-payment-order",
        {
          shippingAddress: formAddress,
        }
      );

      console.log(
        "Payment order response:",
        JSON.stringify(response.data, null, 2)
      );

      navigate("/checkout/payment", {
        state: response.data,
      });
    } catch (err) {
      console.log(
        "Backend error details:",
        JSON.stringify(err.response?.data, null, 2)
      );

      console.log(
        "Address sent to backend:",
        JSON.stringify(formAddress, null, 2)
      );

      console.log("Request error:", err.message);

      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Unable to start checkout. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartLoading || cartItems.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <p className="checkout-loading">Loading checkout...</p>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <main className="checkout-page">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <form onSubmit={handleSubmit} className="shipping-form">
            <h2>Shipping Address</h2>

            <label htmlFor="fullName">
              Full Name
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={address.fullName}
                onChange={handleChange}
                autoComplete="name"
                placeholder="Enter your full name"
                required
              />
            </label>

            <label htmlFor="phone">
              Phone Number
              <input
                id="phone"
                name="phone"
                type="tel"
                value={address.phone}
                onChange={handleChange}
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit mobile number"
                required
              />
            </label>

            <label htmlFor="addressLine1">
              Address
              <textarea
                id="addressLine1"
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleChange}
                autoComplete="street-address"
                placeholder="House number, street, area"
                required
              />
            </label>

            <label htmlFor="city">
              City
              <input
                id="city"
                name="city"
                type="text"
                value={address.city}
                onChange={handleChange}
                autoComplete="address-level2"
                placeholder="Enter your city"
                required
              />
            </label>

            <label htmlFor="state">
              State
              <input
                id="state"
                name="state"
                type="text"
                value={address.state}
                onChange={handleChange}
                autoComplete="address-level1"
                placeholder="Enter your state"
                required
              />
            </label>

            <label htmlFor="pincode">
              Pincode
              <input
                id="pincode"
                name="pincode"
                type="text"
                value={address.pincode}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                placeholder="6-digit pincode"
                required
              />
            </label>

            {error && (
              <p className="checkout-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="checkout-submit"
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Order Summary</h2>

            {cartItems.map((item) => {
              const product = item.product;

              if (!product) return null;

              return (
                <div className="checkout-item" key={product._id}>
                  <span>
                    {product.name} × {item.quantity}
                  </span>

                  <span>
                    ₹
                    {(
                      Number(product.price) * item.quantity
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              );
            })}

            <hr />

            <div className="checkout-total">
              <span>Total</span>
              <span>
                ₹
                {Number(subtotal).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <p className="checkout-note">
              The final payable amount is calculated securely on
              the server. Payment will use Razorpay Test Mode.
            </p>
          </aside>
        </div>
      </main>
    </>
  );
}

export default Checkout;
