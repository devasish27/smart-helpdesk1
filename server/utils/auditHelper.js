// server/utils/auditHelper.js
import AuditLog from "../models/AuditLog.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Write an audit log entry
 * @param {String} userId - ID of the acting user
 * @param {String} action - e.g. "ticket:create", "ticket:update"
 * @param {Object} meta - Extra data like { ticketId, changes }
 * @param {String} traceId - Optional traceId to group logs
 */
export async function logAction(userId, action, meta = {}, traceId = null) {
  try {
    const log = new AuditLog({
      user: userId,
      action,
      meta,
      traceId: traceId || uuidv4(),
    });
    await log.save();
    return log;
  } catch (err) {
    console.error("Audit logging failed:", err.message);
  }
}
