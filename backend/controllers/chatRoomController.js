const ChatRoom = require('../models/chatRoomModel');

// Create a new chat room
const createChatRoom = async (req, res) => {
  try {
    const { firstID, secondID } = req.body;

    // Create a new chat room document
    const newChatRoom = new ChatRoom({
      firstID,
      secondID,
      messages: [],
    });

    await newChatRoom.save();

    res.status(201).json(newChatRoom);
  } catch (error) {
    res.status(500).json({ error: 'Could not create chat room' });
  }
};

// Get all chat rooms
const getAllChatRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find();
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch chat rooms' });
  }
};

// Get a specific chat room by ID
const getChatRoomById = async (req, res) => {
  try {
    const chatRoomId = req.params.id;
    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch chat room' });
  }
};

// Add a new message to a chat room
const addMessageToChatRoom = async (req, res) => {
  try {
    const chatRoomId = req.params.id;
    const { sender, text } = req.body;

    const chatRoom = await ChatRoom.findById(chatRoomId);

    if (!chatRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    chatRoom.messages.push({ sender, text });
    await chatRoom.save();

    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: 'Could not add message to chat room' });
  }
};

module.exports = {
  createChatRoom,
  getAllChatRooms,
  getChatRoomById,
  addMessageToChatRoom,
};
