import { model, Schema } from "mongoose";

export interface ICategoriesSchema {
  name: string;
  description: string;
  image_url: string;
}

const categorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image_url: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

export default model("Category", categorySchema);
