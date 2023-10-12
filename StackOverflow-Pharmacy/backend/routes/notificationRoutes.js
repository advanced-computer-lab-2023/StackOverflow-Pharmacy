const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create a new notification
router.post('/create', notificationController.createNotification);

// Get all notifications
router.get('/all', notificationController.getAllNotifications);

// Get a specific notification by ID
router.get('/:id', notificationController.getNotificationById);

// Delete a notification by ID
router.delete('/:id/delete', notificationController.deleteNotificationById);

module.exports = router;
