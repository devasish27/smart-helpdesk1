import Ticket from "../models/Ticket.js";

export const getOverview = async (req, res) => {
  try {
    const totalTickets = await Ticket.countDocuments();

    const statusCounts = await Ticket.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const autoClosed = await Ticket.countDocuments({ autoClosed: true });
    const agentClosed = await Ticket.countDocuments({ autoClosed: false, status: "closed" });

    // Example: Avg resolution time (createdAt → closedAt)
    const avgResolution = await Ticket.aggregate([
      { $match: { closedAt: { $exists: true } } },
      { $project: { diff: { $subtract: ["$closedAt", "$createdAt"] } } },
      { $group: { _id: null, avg: { $avg: "$diff" } } }
    ]);

    res.json({
      totalTickets,
      statusCounts,
      autoClosed,
      agentClosed,
      avgResolution: avgResolution[0]?.avg || 0
    });
  } catch (err) {
    console.error("Analytics failed", err);
    res.status(500).json({ error: "Failed to load analytics" });
  }
};