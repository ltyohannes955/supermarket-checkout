import { Schema, model, Types } from "mongoose";

export interface IOrdersSchema {
  user: Types.ObjectId;
  products: {
    product: Types.ObjectId;
    quantity: number;
  };
  totalAmount: number;
  status: String;
  discountedAmount: number;
}
const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User", // name of the model (not the file)
      required: true,
    },
    products: [
      {
        product: {
          type: Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    discountedAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Order", orderSchema);
