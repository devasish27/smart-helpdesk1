import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // e.g. CREATED_TICKET, UPDATED_TICKET, STATUS_CHANGE
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    target: { type: String }, // e.g. "Ticket:123"g. "ticket_created", "triage_run"
    details: { type: Object, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);