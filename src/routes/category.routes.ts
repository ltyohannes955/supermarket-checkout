import { Hono } from "hono";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { adminMiddleware, authMiddleware } from "../middleware/auth.middleware";

const categoryRoutes = new Hono();

categoryRoutes.post("/", authMiddleware, adminMiddleware, createCategory);
categoryRoutes.get("/", getAllCategories);
categoryRoutes.get("/:id", getCategoryById);
categoryRoutes.patch("/:id", authMiddleware, adminMiddleware, updateCategory);
categoryRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

export default categoryRoutes;
