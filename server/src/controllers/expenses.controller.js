import { Expense } from "../models/Expense.js";
import { Receipt } from "../models/Receipt.js";
import { ApiError, asyncHandler, sendCreated } from "../utils/http.js";
import { notifyLargeExpense } from "../services/notification.service.js";

function buildExpenseQuery(req) {
  const query = { user: req.user._id };
  if (req.query.category && req.query.category !== "All") query.category = req.query.category;
  if (req.query.search) query.$text = { $search: req.query.search };
  return query;
}

export const listExpenses = asyncHandler(async (req, res) => {
  const sort = req.query.sort || "-date";
  const expenses = await Expense.find(buildExpenseQuery(req)).sort(sort);
  res.json(expenses);
});

export const createExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.create({ ...req.body, user: req.user._id });
  await notifyLargeExpense(req.user, expense);
  return sendCreated(res, expense);
});

export const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
  if (!expense) throw new ApiError(404, "Expense not found");
  res.json(expense);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!expense) throw new ApiError(404, "Expense not found");
  res.json({ id: req.params.id });
});

export const scanReceipt = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Receipt file is required");
  const parsed = {
    merchant: req.file.originalname.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") || "Detected Merchant",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
  };
  await Receipt.create({
    user: req.user._id,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    path: req.file.path,
    merchant: parsed.merchant,
    amount: parsed.amount,
    date: parsed.date,
    rawText: "OCR provider is modular and can be swapped for Gemini Vision, Tesseract, or a document AI service.",
  });
  res.json(parsed);
});
