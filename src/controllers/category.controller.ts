import { Context } from "hono";
import CategoryModel from "../models/category.model";

// Create a new category
export const createCategory = async (c: Context) => {
  try {
    const body = await c.req.json();

    if (Array.isArray(body)) {
      // Bulk insert
      const categories = await CategoryModel.insertMany(body);
      return c.json({ success: true, data: categories }, 201);
    } else {
      // Single insert
      const { name, description, image } = body;
      const category = await CategoryModel.create({ name, description, image });
      return c.json({ success: true, data: category }, 201);
    }
  } catch (error) {
    return c.json(
      { success: false, message: "Failed to create category", error },
      500
    );
  }
};

// Get all categories
export const getAllCategories = async (c: Context) => {
  try {
    const categories = await CategoryModel.find();
    return c.json({ success: true, data: categories });
  } catch (error) {
    return c.json(
      { success: false, message: "Failed to fetch categories", error },
      500
    );
  }
};

// Get a category by ID
export const getCategoryById = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const category = await CategoryModel.findById(id);

    if (!category) {
      return c.json({ success: false, message: "Category not found" }, 404);
    }

    return c.json({ success: true, data: category });
  } catch (error) {
    return c.json(
      { success: false, message: "Failed to fetch category", error },
      500
    );
  }
};

// Update a category
export const updateCategory = async (c: Context) => {
  try {
    const id = c.req.param("id");
    const updates = await c.req.json();

    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCategory) {
      return c.json({ success: false, message: "Category not found" }, 404);
    }

    return c.json({ success: true, data: updatedCategory });
  } catch (error) {
    return c.json(
      { success: false, message: "Failed to update category", error },
      500
    );
  }
};

// Delete a category
export const deleteCategory = async (c: Context) => {
  try {
    const id = c.req.param("id");

    const deleted = await CategoryModel.findByIdAndDelete(id);

    if (!deleted) {
      return c.json({ success: false, message: "Category not found" }, 404);
    }

    return c.json({ success: true, message: "Category deleted" });
  } catch (error) {
    return c.json(
      { success: false, message: "Failed to delete category", error },
      500
    );
  }
};
