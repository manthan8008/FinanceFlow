import { Router } from "express";
import { z } from "zod";
import { updateProfile } from "../controllers/profile.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const profileRouter = Router();
profileRouter.put("/", requireAuth, validate(z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
  currency: z.string().min(3).max(3).optional(),
  monthlyIncome: z.coerce.number().optional(),
  savingsGoal: z.coerce.number().optional(),
})), updateProfile);
