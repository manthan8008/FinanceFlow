import { Router } from "express";
import { z } from "zod";
import { createGoal, deleteGoal, listGoals, updateGoal } from "../controllers/goals.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const goalsRouter = Router();
const goalSchema = z.object({
  type: z.string().default("Custom Goal"),
  name: z.string().min(1),
  targetAmount: z.coerce.number().min(0),
  currentAmount: z.coerce.number().min(0).optional(),
  deadline: z.coerce.date().optional().or(z.literal("")),
  status: z.enum(["active", "completed", "paused"]).optional(),
});

goalsRouter.use(requireAuth);
goalsRouter.get("/", listGoals);
goalsRouter.post("/", validate(goalSchema), createGoal);
goalsRouter.put("/:id", validate(goalSchema.partial()), updateGoal);
goalsRouter.delete("/:id", deleteGoal);
