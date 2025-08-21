import Ticket from "../models/Ticket.js";
import Article from "../models/Article.js";
import AuditLog from "../models/AuditLog.js";
import { OpenAI } from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Simple keyword-based classifier (stub mode)
function classifyStub(text) {
  if (/payment|invoice|refund/i.test(text)) return "billing";
  if (/error|bug|crash|login/i.test(text)) return "tech";
  if (/delivery|tracking|shipping/i.test(text)) return "shipping";
  return "other";
}

export const triageTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    let category;
    let draftReply;
    let confidence;

    if (openai) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a support triage system. Classify the issue into billing/tech/shipping/other and draft a polite reply.",
          },
          { role: "user", content: ticket.description },
        ],
      });

      const reply = completion.choices?.[0]?.message?.content || "";

      // Extract category cleanly instead of ternary nesting
      if (/billing|payment/i.test(reply)) category = "billing";
      else if (/tech|error|bug/i.test(reply)) category = "tech";
      else if (/ship|delivery/i.test(reply)) category = "shipping";
      else category = "other";

      draftReply = reply;
      confidence = 0.85;
    } else {
      // Stub mode
      category = classifyStub(ticket.description);
      draftReply = `Dear customer, your issue seems related to ${category}. Our team will assist you shortly.`;
      confidence = 0.6;
    }

    // Step 2: Retrieve top 3 KB articles
    let kb = [];
    try {
      kb = await Article.find(
        { $text: { $search: ticket.description } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(3);
    } catch {
      kb = await Article.find({
        $or: [
          { title: new RegExp(ticket.description, "i") },
          { body: new RegExp(ticket.description, "i") },
        ],
      }).limit(3);
    }

    // Update ticket fields
    ticket.category = category;
    ticket.draftReply = draftReply;
    ticket.confidence = confidence;
    ticket.kbSuggestions = kb.map((k) => k._id);

    // Step 3: Auto-close if confident enough
    ticket.status = confidence > 0.8 ? "resolved" : "in_progress";

    await ticket.save();

    // Step 4: Audit Log
    await AuditLog.create({
      action: "AI_TRIAGE",
      performedBy: req.user._id,
      target: `Ticket:${ticket._id}`,
      details: { category, confidence },
    });

    res.json(ticket);
  } catch (err) {
    console.error("Triage failed:", err);
    res.status(500).json({ error: "Triage failed" });
  }
};