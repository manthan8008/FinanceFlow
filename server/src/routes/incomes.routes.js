import { Router } from "express";
import { z } from "zod";
import { createIncome, deleteIncome, listIncomes, updateIncome } from "../controllers/incomes.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { INCOME_CATEGORIES } from "../models/Income.js";

export const incomesRouter = Router();
const incomeSchema = z.object({
  source: z.string().min(1),
  amount: z.coerce.number().min(0),
  category: z.enum(INCOME_CATEGORIES).default("Other"),
  date: z.coerce.date().optional(),
  notes: z.string().optional(),
  recurring: z.boolean().optional(),
});

incomesRouter.use(requireAuth);
incomesRouter.get("/", listIncomes);
incomesRouter.post("/", validate(incomeSchema), createIncome);
incomesRouter.put("/:id", validate(incomeSchema.partial()), updateIncome);
incomesRouter.delete("/:id", deleteIncome);
