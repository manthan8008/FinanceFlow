import { Router } from "express";
import { listNotifications, markRead } from "../controllers/notifications.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);
notificationsRouter.get("/", listNotifications);
notificationsRouter.patch("/:id/read", markRead);
