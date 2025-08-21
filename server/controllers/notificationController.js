import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(notifications);
};

export const markRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { read: true });
  res.json({ success: true });
};

// Utility to create notification (call this in ticket updates)
export async function notifyUser(userId, message) {
  const notif = new Notification({ user: userId, message });
  await notif.save();
}