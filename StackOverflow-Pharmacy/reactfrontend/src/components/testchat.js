import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect('http://localhost:4000');

function Chat() {
  // Room State
  const [room, setRoom] = useState('');

  // Messages States
  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('');

  const sendMessage = async () => {
    try {
      // Emit the message to the socket
      socket.emit('send_message', { message, room });
  
      // Fetch to send the message to the server
      const response = await fetch('http://localhost:4000/api/users/sendmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authentication headers
        },
        body: JSON.stringify({
          message,
          firstID: req.user.id,
          secondID: req.body,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setMessageReceived(data);
      } else {
        console.error('Failed to send message to the server');
        // Handle error
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error
    }
  };
  const GetChat = async () => {
    try {
      // Emit the message to the socket
      socket.emit('send_message', { message, room });
  
      // Fetch to send the message to the server
      const response = await fetch('http://localhost:4000/api/users/getChat', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authentication headers
        },
        body: JSON.stringify({
          message,
          firstID: req.user.id,
          secondID: req.body,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setMessageReceived(data);

        // Handle the server response if needed
      } else {
        console.error('Failed to send message to the server');
        // Handle error
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error
    }
  };

  useEffect(() => {
    const fetchRoomNumber = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/users/getroomnumber', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            //i need to add first and second id
          },
          body: JSON.stringify({
            firstID: req.user.id,
            secondID: req.body,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Assuming data.chat has the room number, adjust accordingly
          setRoom(data.chat._id); // Adjust this line based on your data structure
          socket.emit('join_room', room); // Join the room dynamically
        } else {
          console.error('Failed to fetch room number');
        }
      } catch (error) {
        console.error('Error fetching room number:', error);
      }
    };

    fetchRoomNumber();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  useEffect(() => {
    socket.on('receive_message', (data) => {
        GetChat();
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Message:</h1>
      {messageReceived}
    </div>
  );
}

export default Chat;
