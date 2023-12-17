// ChatList.js
import React, { useState } from 'react';
import '../styles/ChatList.css';

const ChatList = ({ firstID,chats,onSelectChat}) => {
  const [username, setusername] = useState('');
  const [secondID, setsecondID] = useState('');
  const [chat, setChat] = useState('');

  const getsecondID = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/searchToChat?username=${username}`, {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const {data} = await response.json();
         setsecondID(data)
      } else {
        console.error('Failed to send message to the server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const selectuser = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/createChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        firstID:firstID,
        secondID:secondID
        }),
      });

      if (response.ok) {
        const {data} = await response.json();
         setChat(data)
      } else {
        console.error('Failed to send message to the server');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  const handleChatItemClick = (chat) => {
    onSelectChat(chat);
  };
  // const filteredChats = chats.filter(chat =>
  //   chat.friendUsername.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="chat-list">
      <div className="search-bar">
        <input
          type="text"
          value={username}
          onChange={(e) => setusername(e.target.value)}
          placeholder="Search chats"
        />
      </div>
      <h2>Chats</h2>
      <ul>
      {chats && chats.map((chat, index) => (
        <li key={index} onClick={() => handleChatItemClick(chat)}>
          {chat.friendUsername}
        </li>
      ))}
    </ul>
    </div>
  );
};
export default ChatList;


