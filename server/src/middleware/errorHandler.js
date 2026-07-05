import mongoose from "mongoose";
import { env } from "../config/env.js";

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || (error instanceof mongoose.Error.ValidationError ? 400 : 500);
  const message = statusCode === 500 && env.NODE_ENV === "production" ? "Internal server error" : error.message;
  res.status(statusCode).json({ message, stack: env.NODE_ENV === "production" ? undefined : error.stack });
}
