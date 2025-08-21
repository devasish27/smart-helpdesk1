import express from "express";
import { getConfig, updateConfig } from "../controllers/configController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, requireRole(["admin"]), getConfig);
router.put("/", authMiddleware, requireRole(["admin"]), updateConfig);

export default router;