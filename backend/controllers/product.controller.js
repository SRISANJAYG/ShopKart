import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      stock,
    });
    return res.status(201).json({ success: true, product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const getAllPorducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    const query = {};
    if (search) {
      query.name = {
        $regex: new RegExp(search, "i"),
      };
    }
    if (category) {
      query.category = category;
    }
    let sortOption = {};

    if (sort === "price_asc") {
      sortOption.price = 1;
    }

    if (sort === "price_desc") {
      sortOption.price = -1;
    }
    const products = await Product.find(query).sort(sortOption);
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
