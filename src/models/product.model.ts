import { Schema, model } from "mongoose";

export interface IProductsSchema {
  name: string;
  price: number;
  description: string;
  age_required: boolean;
}

const ProductsSchema = new Schema<IProductsSchema>({
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
  },
});

const productsModel = model("products", ProductsSchema);

export default productsModel;
