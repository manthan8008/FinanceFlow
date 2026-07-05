import mongoose from "mongoose";
import { EXPENSE_CATEGORIES } from "./Expense.js";

const budgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, enum: EXPENSE_CATEGORIES, required: true },
    limit: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0, min: 0 },
    period: { type: String, enum: ["monthly", "quarterly", "annual"], default: "monthly" },
  },
  { timestamps: true }
);

budgetSchema.index({ user: 1, category: 1, period: 1 }, { unique: true });

export const Budget = mongoose.model("Budget", budgetSchema);
