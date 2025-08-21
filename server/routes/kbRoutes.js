import express from 'express';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { searchKB, createArticle, updateArticle, deleteArticle,getArticleById } from '../controllers/kbController.js';

const router = express.Router();


router.get("/", authMiddleware, searchKB);
router.post("/", authMiddleware, requireRole(["admin"]), createArticle);
router.put("/:id", authMiddleware, requireRole(["admin"]), updateArticle);
router.delete("/:id", authMiddleware, requireRole(["admin"]), deleteArticle);
router.get("/:id", authMiddleware, getArticleById);


export default router;