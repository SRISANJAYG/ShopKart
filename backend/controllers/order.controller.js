
import crypto from "crypto";
import Order from "../models/order.model.js";
import User from "../models/customer.model.js";
import razorpay from "../config/razorpay.js";

const requiredAddressFields = [
  "fullName",
  "phone",
  "addressLine1",
  "city",
  "state",
  "pincode",
];

export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress || typeof shippingAddress !== "object") {
      return res.status(400).json({
        message: "Shipping address is required.",
      });
    }

    // Validate and normalize the shipping address.
    const normalizedAddress = {};

    for (const field of requiredAddressFields) {
      const value = shippingAddress[field];

      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          message: `${field} is required.`,
        });
      }

      normalizedAddress[field] = value.trim();
    }

    if (!/^[6-9]\d{9}$/.test(normalizedAddress.phone)) {
      return res.status(400).json({
        message: "Enter a valid 10-digit Indian mobile number.",
      });
    }

    if (!/^\d{6}$/.test(normalizedAddress.pincode)) {
      return res.status(400).json({
        message: "Enter a valid 6-digit pincode.",
      });
    }

    // Find the logged-in user and populate cart products.
    const user = await User.findById(req.user._id).populate(
      "cart.product"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Use current product prices and check stock on the server.
    for (const cartItem of user.cart) {
      const product = cartItem.product;
      const quantity = Number(cartItem.quantity);

      if (!product) {
        return res.status(400).json({
          message: "A product in your cart no longer exists.",
        });
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}.`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          message: `Invalid price for ${product.name}.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        image: product.image || "",
        quantity,
      });

      totalAmount += price * quantity;
    }

    totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;

    // Create the pending ShopKart order.
    const order = await Order.create({
      user: user._id,
      items: orderItems,
      shippingAddress: normalizedAddress,
      totalAmount,
      paymentStatus: "PENDING",
      status: "PENDING_PAYMENT",
    });

    try {
      // Razorpay expects the amount in paise.
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: order._id.toString(),
      });

      order.razorpayOrderId = razorpayOrder.id;
      await order.save();

      return res.status(201).json({
        message: "Payment order created successfully.",
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (paymentError) {
      await Order.findByIdAndDelete(order._id);
      throw paymentError;
    }
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      message: "Unable to create payment order.",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !orderId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Required payment details are missing.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(200).json({
        message: "Payment has already been verified.",
        orderId: order._id,
        paymentStatus: order.paymentStatus,
      });
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({
        message: "Razorpay order ID does not match.",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("Razorpay secret is not configured.");

      return res.status(500).json({
        message: "Payment verification is not configured.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${order.razorpayOrderId}|${razorpay_payment_id}`)
      .digest();

    let receivedSignature;

    try {
      receivedSignature = Buffer.from(razorpay_signature, "hex");
    } catch {
      return res.status(400).json({
        message: "Invalid payment signature.",
      });
    }

    if (
      receivedSignature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(expectedSignature, receivedSignature)
    ) {
      return res.status(400).json({
        message: "Payment signature verification failed.",
      });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    await User.findByIdAndUpdate(req.user._id, {
      $set: { cart: [] },
    });

    return res.status(200).json({
      message: "Payment verified successfully.",
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      status: order.status,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      message: "Unable to verify payment.",
    });
  }
};
