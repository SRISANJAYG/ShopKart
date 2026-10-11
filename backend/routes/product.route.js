import express from "express";
import { createProduct ,getAllPorducts,getProductById} from "../controllers/product.controller.js";
const productRoutes = express.Router();
productRoutes.post("/",createProduct);
productRoutes.get("/",getAllPorducts);
productRoutes.get("/:id",getProductById);
export default productRoutes;