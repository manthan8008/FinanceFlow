import { Router } from "express";
import { z } from "zod";
import { chat, history } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

export const aiRouter = Router();
aiRouter.use(requireAuth);
aiRouter.get("/history", history);
aiRouter.post("/chat", validate(z.object({ message: z.string().min(1) })), chat);
