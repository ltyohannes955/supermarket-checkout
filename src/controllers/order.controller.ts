import { Context } from "hono";
import Order from "../models/order.model";
import Product from "../models/product.model";
import User from "../models/user.model";
import { isValidObjectId } from "mongoose";

export const createOrder = async (c: Context) => {
  const body = await c.req.json();
  const { userId, items } = body;

  try {
    // Validate user
    const user = await User.findById(userId);
    if (!user) return c.json({ error: "User not found" }, 404);

    let total = 0;
    let discountedAmount = 0;
    const productRefs = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return c.json({ error: `Product ${item.productId} not found` }, 404);

      const quantity = item.quantity;
      const price = product.price;
      const discountRate = product.discount ? product.discount / 100 : 0;

      const originalCost = price * quantity;
      const discountValue = originalCost * discountRate;
      const finalCost = originalCost - discountValue;

      total += finalCost;
      discountedAmount += discountValue;

      productRefs.push({
        product: product._id,
        quantity,
      });
    }

    const newOrder = await Order.create({
      user: user._id,
      products: productRefs,
      totalAmount: total,
      discountedAmount: discountedAmount, // ← optional field in schema
    });

    return c.json(newOrder, 201);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};

export const getAllOrders = async (c: Context) => {
  try {
    const order = await Order.find()
      .populate("user")
      .populate("products.product");

    if (!order) return c.json({ error: "Order not found" }, 404);
    return c.json(order);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};

export const getOrderById = async (c: Context) => {
  const id = c.req.param("id");

  try {
    const order = await Order.findById(id)
      .populate("user")
      .populate("products.product");

    if (!order) return c.json({ error: "Order not found" }, 404);
    return c.json(order);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
};
