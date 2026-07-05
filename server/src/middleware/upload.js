import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import { ApiError } from "../utils/http.js";

const storage = multer.diskStorage({
  destination: "uploads/receipts",
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});

export const receiptUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.mimetype)) return cb(new ApiError(400, "Only JPG, PNG, and PDF receipts are supported"));
    cb(null, true);
  },
});
