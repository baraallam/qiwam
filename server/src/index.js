import "dotenv/config";
import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiters.js";

const app = express();
const port = Number(process.env.PORT || 3001);

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(apiLimiter);
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api", planRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
