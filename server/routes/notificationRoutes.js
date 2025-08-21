import express from "express";
import { getNotifications, markRead } from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.put("/read", authMiddleware, markRead);

export default router;