import AuditLog from "../models/AuditLog.js";

export async function logAction({ traceId, userId, action, details }) {
  try {
    const log = new AuditLog({ traceId, user: userId, action, details });
    await log.save();
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}