import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/http.js";

export const listNotifications = asyncHandler(async (req, res) => {
  res.json(await Notification.find({ user: req.user._id }).sort("-createdAt").limit(50));
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true });
  res.json(notification);
});
