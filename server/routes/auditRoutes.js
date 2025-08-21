import express from "express";
import AuditLog from "../models/AuditLog.js";
import { getLogs } from "../controllers/auditController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

// --- Per-ticket logs (for ticket detail) ---
router.get("/:traceId", authMiddleware, getLogs);

// --- Global logs (admin only) ---
router.get("/", authMiddleware, requireRole(["admin"]), async (req, res) => {
  const logs = await AuditLog.find()
    .populate("user", "email role")   // use 'user' field (matches AuditLog schema)
    .sort({ createdAt: -1 })
    .limit(100);
  res.json(logs);
});

export default router;