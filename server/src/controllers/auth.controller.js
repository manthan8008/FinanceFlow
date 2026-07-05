import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js";
import { FinancialGoal } from "../models/FinancialGoal.js";
import { Income } from "../models/Income.js";
import { PasswordResetToken } from "../models/PasswordResetToken.js";
import { User } from "../models/User.js";
import { ApiError, asyncHandler, sendCreated } from "../utils/http.js";
import { serializeUser } from "../utils/serializers.js";
import { signToken } from "../utils/tokens.js";

function authResponse(user) {
  return { user: serializeUser(user), token: signToken(user) };
}

export const register = asyncHandler(async (req, res) => {
  const existing = await User.findOne({ email: req.body.email.toLowerCase() });
  if (existing) throw new ApiError(409, "Email is already registered");

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    passwordHash: await User.hashPassword(req.body.password),
    currency: req.body.currency,
    monthlyIncome: req.body.monthlyIncome || 0,
    savingsGoal: req.body.savingsGoal || 0,
  });

  return sendCreated(res, authResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+passwordHash");
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new ApiError(401, "Invalid email or password");
  }
  res.json(authResponse(user));
});

export const demoLogin = asyncHandler(async (_req, res) => {
  const passwordHash = await User.hashPassword(env.DEMO_PASSWORD);
  const user = await User.findOneAndUpdate(
    { email: env.DEMO_EMAIL },
    {
      $setOnInsert: {
        name: "Demo User",
        email: env.DEMO_EMAIL,
        passwordHash,
        currency: "INR",
        monthlyIncome: 125000,
        savingsGoal: 45000,
        isDemo: true,
      },
    },
    { upsert: true, new: true }
  );

  const [expenseCount, incomeCount, budgetCount, goalCount] = await Promise.all([
    Expense.countDocuments({ user: user._id }),
    Income.countDocuments({ user: user._id }),
    Budget.countDocuments({ user: user._id }),
    FinancialGoal.countDocuments({ user: user._id }),
  ]);

  if (!expenseCount) {
    await Expense.insertMany([
      { user: user._id, title: "Apartment rent", amount: 48000, category: "Rent", date: new Date(), paymentMethod: "Bank Transfer", merchant: "Greenview Homes" },
      { user: user._id, title: "Team dinner", amount: 7200, category: "Food", date: new Date(), paymentMethod: "Credit Card", merchant: "Olive Bistro" },
      { user: user._id, title: "Metro pass", amount: 2600, category: "Transport", date: new Date(), paymentMethod: "UPI", merchant: "Metro Rail" },
      { user: user._id, title: "Streaming bundle", amount: 1599, category: "Entertainment", date: new Date(), paymentMethod: "Credit Card", merchant: "Prime Media" },
    ]);
  }
  if (!incomeCount) {
    await Income.insertMany([
      { user: user._id, source: "Product salary", amount: 165000, category: "Salary", date: new Date() },
      { user: user._id, source: "Design consulting", amount: 18000, category: "Freelance", date: new Date() },
    ]);
  }
  if (!budgetCount) {
    await Budget.insertMany([
      { user: user._id, category: "Food", limit: 18000, spent: 7200 },
      { user: user._id, category: "Rent", limit: 50000, spent: 48000 },
      { user: user._id, category: "Entertainment", limit: 7000, spent: 1599 },
    ]);
  }
  if (!goalCount) {
    await FinancialGoal.create({ user: user._id, type: "Emergency Fund", name: "Six month safety net", targetAmount: 600000, currentAmount: 355000 });
  }

  res.json(authResponse(user));
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+passwordHash");
  if (!(await user.comparePassword(req.body.currentPassword))) throw new ApiError(400, "Current password is incorrect");
  user.passwordHash = await User.hashPassword(req.body.newPassword);
  await user.save();
  res.json({ message: "Password updated" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (user) {
    const token = crypto.randomBytes(20).toString("hex");
    await PasswordResetToken.create({
      user: user._id,
      tokenHash: await bcrypt.hash(token, 12),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });
    if (env.NODE_ENV !== "production") console.log(`Password reset token for ${user.email}: ${token}`);
  }
  res.json({ message: "If that email exists, reset instructions were generated" });
});

export const confirmResetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) throw new ApiError(400, "Invalid reset token");
  const tokens = await PasswordResetToken.find({ user: user._id, usedAt: null, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).limit(5);
  const match = await tokens.reduce(async (foundPromise, token) => {
    const found = await foundPromise;
    if (found) return found;
    return bcrypt.compare(req.body.token, token.tokenHash) ? token : null;
  }, Promise.resolve(null));
  if (!match) throw new ApiError(400, "Invalid reset token");
  user.passwordHash = await User.hashPassword(req.body.password);
  match.usedAt = new Date();
  await Promise.all([user.save(), match.save()]);
  res.json({ message: "Password updated" });
});
