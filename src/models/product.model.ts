import { Schema, Types, model } from "mongoose";

export interface IProductsSchema {
  name: string;
  price: number;
  description: string;
  age_required: {
    required: boolean;
    age: number;
  };
  discount: number;
  category: Types.ObjectId;
  image_url: string;
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
      required: {
        type: Boolean,
        require: true,
        default: false,
      },
      age: {
        type: Number,
        required: false,
        default: 0,
      },
    },

    discount: {
      type: Number,
      required: true,
      default: 0,
    },
    image_url: {
      type: String,
      require: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Product", ProductsSchema);
