import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRoutes from "./routes/product.route.js";

import customerRoutes from "./routes/customer.routes.js";

import wishlistRoutes from "./routes/wishlist.routes.js";

import cartRoutes from "./routes/cart.routes.js";

import orderRoutes from "./routes/order.routes.js";

const app = express();

dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/users", customerRoutes);
app.use("/products",productRoutes);
app.use("/wishlist",wishlistRoutes)
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
mongoose
  .connect(process.env.dbUrl)
  .then(() => console.log("Db Connected"))
  .catch((err) => console.log(err));

app.listen(8084, () => {
  console.log("Server Started at 8084");
});