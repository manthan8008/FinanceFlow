import { AIChatHistory } from "../models/AIChatHistory.js";
import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { Income } from "../models/Income.js";
import { askGemini } from "../services/gemini.service.js";
import { asyncHandler } from "../utils/http.js";

export const history = asyncHandler(async (req, res) => {
  res.json(await AIChatHistory.find({ user: req.user._id }).sort("createdAt").limit(80));
});

export const chat = asyncHandler(async (req, res) => {
  const [expenses, incomes, budgets] = await Promise.all([
    Expense.find({ user: req.user._id }).sort("-date").limit(80),
    Income.find({ user: req.user._id }).sort("-date").limit(40),
    Budget.find({ user: req.user._id }),
  ]);
  await AIChatHistory.create({ user: req.user._id, role: "user", content: req.body.message });
  const content = await askGemini({ message: req.body.message, context: { expenses, incomes, budgets, profile: req.user } });
  const assistant = await AIChatHistory.create({ user: req.user._id, role: "assistant", content });
  res.json(assistant);
});
