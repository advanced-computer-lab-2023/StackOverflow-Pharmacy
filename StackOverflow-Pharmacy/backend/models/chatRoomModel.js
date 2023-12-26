const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  text: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const chatRoomSchema = new mongoose.Schema({
  firstID: {
    type: String,
    required: true,
  },
  secondID: {
    type: String,
    required: true,
  },
  messages: {type: [messageSchema]},
});

const ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
// const Message = mongoose.model('Message', messageSchema); // Add this line
module.exports = ChatRoom; // Update this line