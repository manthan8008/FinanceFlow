import { FinancialGoal } from "../models/FinancialGoal.js";
import { ApiError, asyncHandler, sendCreated } from "../utils/http.js";
import { notifyGoalReached } from "../services/notification.service.js";

export const listGoals = asyncHandler(async (req, res) => {
  res.json(await FinancialGoal.find({ user: req.user._id }).sort("-createdAt"));
});

export const createGoal = asyncHandler(async (req, res) => {
  const goal = await FinancialGoal.create({ ...req.body, user: req.user._id });
  await notifyGoalReached(req.user, goal);
  return sendCreated(res, goal);
});

export const updateGoal = asyncHandler(async (req, res) => {
  const goal = await FinancialGoal.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true });
  if (!goal) throw new ApiError(404, "Goal not found");
  await notifyGoalReached(req.user, goal);
  res.json(goal);
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await FinancialGoal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!goal) throw new ApiError(404, "Goal not found");
  res.json({ id: req.params.id });
});
