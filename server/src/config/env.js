import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 5000),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/financeflow",
  JWT_SECRET:
    process.env.JWT_SECRET || "dev-secret-change-before-production-32chars",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  DEMO_EMAIL: process.env.DEMO_EMAIL || "demo@financeflow.app",
  DEMO_PASSWORD: process.env.DEMO_PASSWORD || "Demo@12345",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
};
