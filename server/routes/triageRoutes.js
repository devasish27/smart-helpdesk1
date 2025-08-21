import express from "express";
import { triageTicket } from "../controllers/triageController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post("/:id/triage", authMiddleware, requireRole(["admin","agent"]), triageTicket);

export default router;