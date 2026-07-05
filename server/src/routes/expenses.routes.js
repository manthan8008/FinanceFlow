import { Router } from "express";
import { z } from "zod";
import { createExpense, deleteExpense, listExpenses, scanReceipt, updateExpense } from "../controllers/expenses.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { receiptUpload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { EXPENSE_CATEGORIES } from "../models/Expense.js";

export const expensesRouter = Router();
const expenseSchema = z.object({
  title: z.string().min(1),
  amount: z.coerce.number().min(0),
  category: z.enum(EXPENSE_CATEGORIES).default("Other"),
  date: z.coerce.date().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  merchant: z.string().optional(),
  receiptImage: z.string().optional(),
  recurring: z.boolean().optional(),
});

expensesRouter.use(requireAuth);
expensesRouter.get("/", listExpenses);
expensesRouter.post("/", validate(expenseSchema), createExpense);
expensesRouter.post("/scan-receipt", receiptUpload.single("receipt"), scanReceipt);
expensesRouter.put("/:id", validate(expenseSchema.partial()), updateExpense);
expensesRouter.delete("/:id", deleteExpense);
