import { Schema, model } from "mongoose";

export interface IProductsSchema {
  name: string;
  price: number;
  description: string;
  age_required: boolean;
  discount: number;
}

const ProductsSchema = new Schema<IProductsSchema>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    age_required: {
      type: Boolean,
      required: true,
      default: false,
    },
    discount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export default model("Product", ProductsSchema);
