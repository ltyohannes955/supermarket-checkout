import { Context } from "hono";
import Product from "../models/product.model";
import { isValidObjectId } from "mongoose";

export const getAllProducts = async (c: Context) => {
  try {
    const products = await Product.find().populate("category");
    return c.json({ success: true, data: products });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
};

export const createProduct = async (c: Context) => {
  try {
    const data = await c.req.json();

    if (Array.isArray(data)) {
      const savedProducts = await Product.insertMany(data);
      const populatedProducts = await Product.find({
        _id: { $in: savedProducts.map((p) => p._id) },
      }).populate("category");
      return c.json({ success: true, data: populatedProducts }, 201);
    } else {
      const product = new Product(data);
      const savedProduct = await product.save();
      const populatedProduct = await Product.findById(
        savedProduct._id
      ).populate("category");
      return c.json({ success: true, data: populatedProduct }, 201);
    }
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 400);
  }
};

export const getProductById = async (c: Context) => {
  const id = c.req.param("id");
  if (!isValidObjectId(id)) return c.json({ error: "Invalid ID" }, 400);

  try {
    const product = await Product.findById(id).populate("category");
    if (!product) return c.json({ error: "Product not found" }, 404);
    return c.json({ success: true, data: product });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};

export const updateProductById = async (c: Context) => {
  const id = c.req.param("id");
  if (!isValidObjectId(id)) return c.json({ error: "Invalid ID" }, 400);

  const data = await c.req.json();
  try {
    const updated = await Product.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("category");
    if (!updated) return c.json({ error: "Product not found" }, 404);
    return c.json({ success: true, data: updated });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};

export const deleteProductById = async (c: Context) => {
  const id = c.req.param("id");
  if (!isValidObjectId(id)) return c.json({ error: "Invalid ID" }, 400);

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return c.json({ error: "Product not found" }, 404);
    return c.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};
