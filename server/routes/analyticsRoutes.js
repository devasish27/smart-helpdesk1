import express from "express";
import { getOverview } from "../controllers/analyticsController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/overview", authMiddleware, requireRole(["admin"]), getOverview);

export default router;