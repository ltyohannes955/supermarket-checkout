import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { logger } from "hono/logger";
import connectDB from "./db/connect";
import { cors } from "hono/cors";

import productRoutes from "./routes/product.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/order.routes";
import categoryRoutes from "./routes/category.routes";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowed = [
        "http://localhost:3000",
        "https://supermarket-ui-seven.vercel.app/",
      ];
      return allowed.includes(origin ?? "") ? origin : "";
    },
    credentials: true,
  })
);
app.use("*", poweredBy());
app.use("*", logger());

// Mount routes
app.route("/products", productRoutes);
app.route("/users", userRoutes);
app.route("/auth", authRoutes);
app.route("/orders", orderRoutes);
app.route("/categories", categoryRoutes);

// Connect DB and start server
(async () => {
  await connectDB();

  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  });
})();

console.log("🚀 Server running at http://localhost:3000");
