import { Hono } from "hono";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/product.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = new Hono();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes (admin only)
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.patch("/:id", authMiddleware, adminMiddleware, updateProductById);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProductById);

export default router;
