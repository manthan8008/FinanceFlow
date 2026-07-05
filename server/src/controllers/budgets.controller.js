import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { ApiError, asyncHandler, sendCreated } from "../utils/http.js";
import { currentMonthRange } from "../utils/dateRanges.js";

async function withSpent(budget) {
  const { start, end } = currentMonthRange();
  const result = await Expense.aggregate([
    { $match: { user: budget.user, category: budget.category, date: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const object = budget.toObject();
  object.spent = result[0]?.total || object.spent || 0;
  return object;
}

export const listBudgets = asyncHandler(async (req, res) => {
  const budgets = await Budget.find({ user: req.user._id }).sort("category");
  res.json(await Promise.all(budgets.map(withSpent)));
});

export const createBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndUpdate(
    { user: req.user._id, category: req.body.category, period: req.body.period || "monthly" },
    { ...req.body, user: req.user._id },
    { upsert: true, new: true, runValidators: true }
  );
  return sendCreated(res, await withSpent(budget));
});

export const updateBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
  if (!budget) throw new ApiError(404, "Budget not found");
  res.json(await withSpent(budget));
});

export const deleteBudget = asyncHandler(async (req, res) => {
  const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!budget) throw new ApiError(404, "Budget not found");
  res.json({ id: req.params.id });
});
