const Notification = require('../models/notificationModel');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userID, title, content, type } = req.body;

    // Create a new notification document
    const newNotification = new Notification({
      userID,
      title,
      content,
      type,
    });

    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: 'Could not create notification' });
  }
};

// Get all notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch notifications' });
  }
};

// Get a specific notification by ID
const getNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch notification' });
  }
};

// Delete a notification by ID
const deleteNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndRemove(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(204).json(); // No content
  } catch (error) {
    res.status(500).json({ error: 'Could not delete notification' });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  getNotificationById,
  deleteNotificationById,
};
