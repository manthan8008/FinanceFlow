import { Router } from "express";
import { report, reportPdf } from "../controllers/reports.controller.js";
import { requireAuth } from "../middleware/auth.js";

export const reportsRouter = Router();
reportsRouter.use(requireAuth);
reportsRouter.get("/:type", report);
reportsRouter.get("/:type/pdf", reportPdf);
