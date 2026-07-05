import { Router } from "express";
import { summary } from "../controllers/dashboard.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRouter = Router();
dashboardRouter.get("/summary", requireAuth, summary);
