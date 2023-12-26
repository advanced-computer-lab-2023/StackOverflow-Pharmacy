// ChatWindowWithSocket.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/ChatWindow.css';
const socket = io.connect('http://localhost:4000');

const ChatWindow = ({ chat, username }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [room, setRoom] = useState('');

  const sendMessage = async () => {
    try {
      socket.emit('send_message', { message: inputMessage, room, username });

      fetch('http://localhost:4000/api/users/sendmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputMessage,
          chat: chat,
          sender: username,
        }),
      });

      let newMessage = { sender: username, text: inputMessage, date: Date.now() };
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    setRoom(chat._id);
    socket.emit('join_room', chat._id);
    setMessages(chat.messages);
  }, [chat]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      let newMessage = { sender: data.username, text: data.message, date: Date.now() };
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);

  useEffect(() => {
    const messagesContainer = document.querySelector('.messages-container');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      {chat ? (
        <>
          <div className="messages-container">
            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === username ? 'sender-message' : 'receiver-message'}`}
                >
                  <span className="username">{message.sender}: </span>
                  <span className="content">{message.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message"
            />
            <button onClick={sendMessage} className="send-button">
              Send
            </button>
          </div>
        </>
      ) : (
        <div className="select-chat-message">Select a chat to start messaging</div>
      )}
    </div>
  );
};

export default ChatWindow;