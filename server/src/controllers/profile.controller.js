import { asyncHandler } from "../utils/http.js";
import { serializeUser } from "../utils/serializers.js";

export const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "email", "avatar", "currency", "monthlyIncome", "savingsGoal"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  }
  await req.user.save();
  res.json({ user: serializeUser(req.user) });
});
