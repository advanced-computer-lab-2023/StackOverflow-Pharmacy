// ChatList.js
import React, { useState, useEffect } from 'react';
import '../styles/ChatList.css';

const ChatList = ({ firstID, chats, onSelectChat }) => {
  const [usernames, setUsernames] = useState({});

  const getUserName = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/getUsername?ID=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const  data  = await response.json();
        console.log(data)
        setUsernames((prevUsernames) => ({
          ...prevUsernames,
          [id]: data,
        }));
      } else {
        console.error('Failed to get username from the server');
      }
    } catch (error) {
      console.error('Error getting username:', error);
    }
  };

  useEffect(() => {
    // Fetch usernames for each chat
    chats.forEach((chat) => {
      if (!usernames[chat.secondID]) {
        getUserName(chat.secondID);
      }
    });
  }, [chats, usernames]);

  const handleChatItemClick = (chat) => {
    onSelectChat(chat);
  };

  return (
    <div className="chat-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search chats"
          readOnly // Prevent user input, you can remove this if you want a user to input usernames directly
        />
      </div>
      <h2>Chats</h2>
      <ul>
  {chats &&
    chats.map((chat, index) => (
      <li key={index} onClick={() => handleChatItemClick(chat)}>
        {usernames[chat.secondID] && usernames[chat.secondID].username ? (
          usernames[chat.secondID].username
        ) : (
          'Loading...'
        )}
      </li>
    ))}
</ul>

    </div>
  );
};

export default ChatList;