import AuditLog from "../models/AuditLog.js";

export const getLogs = async (req, res) => {
  const { traceId } = req.params;
  const logs = await AuditLog.find({ traceId })
    .populate("user", "email role")
    .sort({ createdAt: 1 });
  res.json(logs);
};