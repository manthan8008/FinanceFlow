import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { aiRouter } from "./routes/ai.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { budgetsRouter } from "./routes/budgets.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { expensesRouter } from "./routes/expenses.routes.js";
import { goalsRouter } from "./routes/goals.routes.js";
import { incomesRouter } from "./routes/incomes.routes.js";
import { notificationsRouter } from "./routes/notifications.routes.js";
import { profileRouter } from "./routes/profile.routes.js";
import { reportsRouter } from "./routes/reports.routes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { sanitizeMongoInput } from "./middleware/sanitize.js";

export const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, "../../client/dist");
const shouldServeClient =
  env.NODE_ENV === "production" && existsSync(clientDistPath);
const allowedOrigins = env.CLIENT_URL.split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");
      return callback(null, allowedOrigins.includes(normalizedOrigin));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeMongoInput);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static("uploads"));

if (shouldServeClient) {
  app.use(express.static(clientDistPath));
}

app.get("/", (_req, res) => res.json({ message: "FinanceFlow API is running" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/incomes", incomesRouter);
app.use("/api/budgets", budgetsRouter);
app.use("/api/goals", goalsRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/ai", aiRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/reports", reportsRouter);

if (shouldServeClient) {
  app.get(/^\/(?!api\/|assets\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use(notFound);
app.use(errorHandler);
