const express = require('express');
const router = express.Router();
const chatRoomController = require('../controllers/chatRoomController');

// Create a new chat room
router.post('/create', chatRoomController.createChatRoom);

// Get all chat rooms
router.get('/all', chatRoomController.getAllChatRooms);

// Get a specific chat room by ID
router.get('/:id', chatRoomController.getChatRoomById);

// Add a new message to a chat room
router.post('/:id/addMessage', chatRoomController.addMessageToChatRoom);

module.exports = router;
