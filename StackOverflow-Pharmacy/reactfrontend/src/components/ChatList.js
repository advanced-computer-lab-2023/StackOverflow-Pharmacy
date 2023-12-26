import React, { useState, useEffect } from 'react';
import '../styles/ChatList.css';

const ChatList = ({ chats, onSelectChat, role }) => {
  const [searchText, setSearchText] = useState('');

  const handleChatItemClick = (chat) => {
    onSelectChat(chat);
  };

  const filteredChats = chats.filter((chat) =>
    chat.secondID.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="chat-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search chats"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <h2>Chats</h2>
      <ul>
        {filteredChats.map((chat, index) => (
          <li key={index} onClick={() => handleChatItemClick(chat)}>
            {role === "Patient" ? (
              // Display username if available, otherwise show "Loading..."
              chat.secondID || 'Loading...'
            ) : (
              // Display username if available, otherwise show "Loading..."
              chat.firstID || 'Loading...'
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;