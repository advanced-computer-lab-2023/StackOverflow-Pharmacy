// MainComponent.js
import React, { useEffect, useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './chatWindow';
import '../styles/MainComponent.css';

const MainComponent = () => {
  const [chats, setChats] = useState([]);
  const [firstID, setFirstID] = useState('');
  const [selectedChat, setSelectedChat] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // Get user ID
      try {
       fetch("http://localhost:4000/api/users/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => response.json())
        .then((data) => {
          setFirstID(data._id);
        })
        .catch((error) =>
          console.error('Error removing medicine from cart:', error)
        );
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      // Get chats
      try {
        //console.log(firstID)
        if(firstID){
        fetch(`http://localhost:4000/api/users/getChats?firstID=${firstID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json())
        .then((data) => {
          const chat=data.chats
          setChats(chat);
        })
        .catch((error) =>
          console.error('Error removing medicine from cart:', error)
        );

       
      }} catch (error) {
        console.error('Error getting chat:', error);
      }
    };

    fetchData();
  }, [firstID]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <div className="main-container">
      <ChatList chats={chats} firstID={firstID} onSelectChat={setSelectedChat} />
      {console.log(selectedChat)}
      {selectedChat && <ChatWindow chat={selectedChat} />}
    </div>
  );
};

export default MainComponent;
