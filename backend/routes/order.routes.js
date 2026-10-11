import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { createPaymentOrder,verifyPayment } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-payment-order", isAuthenticated, createPaymentOrder);
router.post(
  "/verify-payment",
  isAuthenticated,
  verifyPayment
);
export default router;
