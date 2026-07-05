import mongoose from "mongoose";

export const INCOME_CATEGORIES = ["Salary", "Freelance", "Business", "Investment", "Gifts", "Other"];

const incomeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    source: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, enum: INCOME_CATEGORIES, default: "Other" },
    date: { type: Date, default: Date.now, index: true },
    notes: { type: String, default: "", trim: true },
    recurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Income = mongoose.model("Income", incomeSchema);
