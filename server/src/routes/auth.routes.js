import { Router } from "express";
import { z } from "zod";
import { changePassword, confirmResetPassword, demoLogin, login, me, register, resetPassword } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const authRouter = Router();

authRouter.post("/register", validate(z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  currency: z.string().min(3).max(3).default("INR"),
  monthlyIncome: z.coerce.number().optional(),
  savingsGoal: z.coerce.number().optional(),
})), register);
authRouter.post("/login", validate(z.object({ email: z.string().email(), password: z.string().min(1) })), login);
authRouter.post("/demo", demoLogin);
authRouter.get("/me", requireAuth, me);
authRouter.post("/change-password", requireAuth, validate(z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(8) })), changePassword);
authRouter.post("/reset-password", validate(z.object({ email: z.string().email() })), resetPassword);
authRouter.post("/confirm-reset-password", validate(z.object({ email: z.string().email(), token: z.string().min(8), password: z.string().min(8) })), confirmResetPassword);
