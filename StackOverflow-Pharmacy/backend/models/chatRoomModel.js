const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: String, // Assuming 'sender' can be either 'firstID' or 'secondID' from the chat room
  text: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const chatRoomSchema = new mongoose.Schema({
  firstID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the first user
    required: true,
  },
  secondID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model for the second user
    required: true,
  },
  messages: [messageSchema],
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);

module.exports = ChatRoom;
