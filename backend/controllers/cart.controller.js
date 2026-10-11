import mongoose from "mongoose";
import User from "../models/customer.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found ",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId,
    );
    if (cartItem) {
      if (cartItem.quantity >= product.stock) {
        return res.status(400).json({
          success: false,
          message: "Cannot add more than available stock",
        });
      }
      cartItem.quantity += 1;
    } else {
      if (product.stock < 1) {
        return res.status(400).json({
          success: false,
          message: "Product is out of stock",
        });
      }
      user.cart.push({
        product: product._id,
        quantity: 1,
      });
    }
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cart.product",
      select: "name price image stock category",
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid prodcut ID",
      });
    }
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Quantity exceeds available stock",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId,
    );
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
    cartItem.quantity = quantity;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const exists = user.cart.some(
      (item) => item.product.toString() == productId,
    );
    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId,
    );
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: user.cart,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
