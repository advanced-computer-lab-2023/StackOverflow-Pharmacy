import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get('jwt', { domain: 'localhost', path: '/' });
    console.log('Auth token:', authToken);
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

  const getUserId = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users/profile', {
        method: 'GET',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const user = await response.json();
        return user._id;
      } else {
        console.error('Error fetching user profile:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const userId = await getUserId();
        const response = await fetch(`http://localhost:4000/api/pharmacists/notifications/${userId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const fetchedNotifications = await response.json();
          setNotifications(fetchedNotifications);
        } else {
          console.error('Error fetching notifications:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchAllNotifications();
  }, [authToken]); // Include dependencies if needed

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        All Notifications
      </Typography>
      {notifications.length > 0 ? (
        <Paper elevation={3}>
          <List>
            {notifications.map((notification) => (
              <ListItem key={notification._id}>
                <ListItemText
                  primary={notification.message}
                  secondary={new Date(notification.timestamp).toLocaleString()}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography>No notifications available.</Typography>
      )}
    </div>
  );
};

export default AllNotifications;
