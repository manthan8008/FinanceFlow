import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import { asyncHandler } from "../utils/http.js";

export const report = asyncHandler(async (req, res) => {
  const [expenses, incomes, budgets] = await Promise.all([
    Expense.find({ user: req.user._id }).sort("-date"),
    Income.find({ user: req.user._id }).sort("-date"),
    Budget.find({ user: req.user._id }).sort("category"),
  ]);
  res.json({ type: req.params.type, expenses, incomes, budgets });
});

export const reportPdf = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort("-date").limit(100);
  const lines = [`FinanceFlow ${req.params.type} report`, "", ...expenses.map((item) => `${item.date.toISOString().slice(0, 10)} ${item.category} ${item.title} ${item.amount}`)];
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${req.params.type}-report.pdf"`);
  res.end(Buffer.from(lines.join("\n")));
});
