import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    path: { type: String, required: true },
    merchant: { type: String, default: "" },
    amount: { type: Number, default: 0 },
    date: { type: Date },
    rawText: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Receipt = mongoose.model("Receipt", receiptSchema);
