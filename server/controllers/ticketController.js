import Ticket from "../models/Ticket.js";
import Article from "../models/Article.js";
import AuditLog from "../models/AuditLog.js";
import { logAction } from "../utils/auditHelper.js"; // only import, no duplicate function

// --- GET all tickets (admin/agent) or user’s tickets ---
export const getTickets = async (req, res) => {
  const filter = req.user.role === "user" ? { createdBy: req.user._id } : {};
  const tickets = await Ticket.find(filter)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
    .sort({ updatedAt: -1 });
  res.json(tickets);
};

// --- GET one ticket ---
export const getTicketById = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email")
    .populate("kbSuggestions", "title");
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
};

// --- CREATE ticket ---
export const createTicket = async (req, res) => {
  try {
    const ticket = new Ticket({ ...req.body, createdBy: req.user.id });
    await ticket.save();

    await logAction(req.user.id, "ticket:create", { ticketId: ticket._id });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- UPDATE ticket ---
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    await logAction(req.user.id, "ticket:update", {
      ticketId: ticket._id,
      changes: req.body,
    });

    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- DELETE ticket ---
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    await logAction(req.user.id, "ticket:delete", { ticketId: req.params.id });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- TRIAGE ticket ---
export const triageTicket = async (req, res) => {
  try {
    // your AI/stub triage logic here ...
    const result = { category: "tech", confidence: 0.92 };

    await logAction(req.user.id, "ticket:triage", {
      ticketId: req.params.id,
      result,
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};