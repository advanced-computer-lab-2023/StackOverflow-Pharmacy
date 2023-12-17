// ChatWindowWithSocket.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:4000');

const ChatWindow = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [room, setRoom] = useState('');
  const [messageReceived, setMessageReceived] = useState('');

  const sendMessage = async () => {
    try {
      setRoom(chat._id);
      socket.emit('send_message', { message: inputMessage, room });

      fetch('http://localhost:4000/api/users/sendmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputMessage,
          chat: chat,
        }),
      });
     let newmessge={sender: 'omar',text:inputMessage,date:Date.now}
      let newmessage = [...messages, newmessge];
      setMessages(newmessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      let newmessge={sender: 'omar',text:data,date:Date.now}
      let newmessage = [...messages, newmessge];
      setMessages(newmessage);
      fetch('http://localhost:4000/api/users/sendmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: data,
          chat: chat,
        }),
      });
    });
  }, [socket, inputMessage]);

  useEffect(() => {
    setMessages(chat.messages);
  }, [chat]);

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
                <div key={index} 
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
