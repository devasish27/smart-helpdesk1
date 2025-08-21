import express from "express";
import { getTickets, getTicketById, createTicket, updateTicket, deleteTicket } from "../controllers/ticketController.js";
import { authMiddleware, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTickets);
router.get("/:id", getTicketById);
router.post("/", requireRole(["user", "admin", "agent"]), createTicket);
router.put("/:id", requireRole(["admin", "agent"]), updateTicket);
router.delete("/:id", requireRole(["admin"]), deleteTicket);

export default router;