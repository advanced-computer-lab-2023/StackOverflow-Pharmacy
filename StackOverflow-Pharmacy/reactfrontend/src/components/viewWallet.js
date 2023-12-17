// MainComponent.js
import React, { useEffect, useState } from 'react';
import '../styles/MainComponent.css';

const Wallet = () => {
  const [wallet, setWallet] = useState('');
  const [firstID, setFirstID] = useState('');


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
        fetch(`http://localhost:4000/api/users/getWallet?firstID=${firstID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then((response) => response.json())
        .then((data) => {
          const wallet=data.wallet
          setWallet(wallet);
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



  return (
    <div className="main-container">
     <p>my Wallet: {wallet}</p>
    </div>
  );
};

export default Wallet;
