import { Hono } from "hono";
import {
  createOrder,
  getAllOrders,
  getOrderById,
} from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = new Hono();

router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, createOrder);

export default router;
