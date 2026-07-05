import { Income } from "../models/Income.js";
import { ApiError, asyncHandler, sendCreated } from "../utils/http.js";

export const listIncomes = asyncHandler(async (req, res) => {
  res.json(await Income.find({ user: req.user._id }).sort("-date"));
});

export const createIncome = asyncHandler(async (req, res) => {
  return sendCreated(res, await Income.create({ ...req.body, user: req.user._id }));
});

export const updateIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
  if (!income) throw new ApiError(404, "Income not found");
  res.json(income);
});

export const deleteIncome = asyncHandler(async (req, res) => {
  const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!income) throw new ApiError(404, "Income not found");
  res.json({ id: req.params.id });
});
