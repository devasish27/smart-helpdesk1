import Ticket from "../models/Ticket.js";
import Article from "../models/Article.js";
import AuditLog from "../models/AuditLog.js";

// Helper to log actions
async function logAction(userId, action, target, details = {}) {
  await AuditLog.create({ performedBy: userId, action, target, details });
}

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

// --- CREATE ---
export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({ ...req.body, createdBy: req.user._id });

    // Suggest KB articles based on description keywords
    const suggestions = await Article.find({
      $text: { $search: ticket.description },
    }).limit(3);

    ticket.kbSuggestions = suggestions.map((a) => a._id);
    await ticket.save();

    await logAction(req.user._id, "CREATED_TICKET", `Ticket:${ticket._id}`, {
      title: ticket.title,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- UPDATE (assign, change status, edit) ---
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    await logAction(
      req.user._id,
      "UPDATED_TICKET",
      `Ticket:${ticket._id}`,
      req.body
    );

    // 🔔 Notify user when status changes
    if (req.body.status) {
      // you can implement notifyUser via WebSocket or email stub
      console.log(
        `Notify: Ticket "${ticket.title}" status changed to ${ticket.status}`
      );
    }

    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// --- DELETE (admins only) ---
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    await logAction(req.user._id, "DELETED_TICKET", `Ticket:${ticket._id}`);

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};