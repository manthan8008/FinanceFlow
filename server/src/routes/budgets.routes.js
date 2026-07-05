import { Router } from "express";
import { z } from "zod";
import { createBudget, deleteBudget, listBudgets, updateBudget } from "../controllers/budgets.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { EXPENSE_CATEGORIES } from "../models/Expense.js";

export const budgetsRouter = Router();
const budgetSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES),
  limit: z.coerce.number().min(0),
  spent: z.coerce.number().min(0).optional(),
  period: z.enum(["monthly", "quarterly", "annual"]).default("monthly"),
});

budgetsRouter.use(requireAuth);
budgetsRouter.get("/", listBudgets);
budgetsRouter.post("/", validate(budgetSchema), createBudget);
budgetsRouter.put("/:id", validate(budgetSchema.partial()), updateBudget);
budgetsRouter.delete("/:id", deleteBudget);
