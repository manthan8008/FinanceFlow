import mongoose from "mongoose";

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Bills",
  "Education",
  "Travel",
  "Investment",
  "Other",
];

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, enum: EXPENSE_CATEGORIES, default: "Other", index: true },
    date: { type: Date, default: Date.now, index: true },
    paymentMethod: { type: String, default: "UPI", trim: true },
    notes: { type: String, default: "", trim: true },
    merchant: { type: String, default: "", trim: true },
    receiptImage: { type: String, default: "" },
    recurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
