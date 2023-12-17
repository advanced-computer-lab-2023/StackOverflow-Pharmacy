// AllNotifications.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const AllNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

  const getUserId = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const user = await response.json();
        return user._id;
      } else {
        console.error("Error fetching user profile:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const userId = await getUserId(); // Assume you have a getUserId function
        const response = await fetch(
          `http://localhost:4000/api/pharmacists/notifications/${userId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const fetchedNotifications = await response.json();
          setNotifications(fetchedNotifications);
        } else {
          console.error("Error fetching notifications:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchAllNotifications();
  }, [authToken]); // Include dependencies if needed

  return (
    <div>
      <h2>All Notifications</h2>
      {notifications.length > 0 ? (
        <ul className="notification-list">
          {notifications.map((notification) => (
            <li key={notification._id} className="notification-item">
              <strong>{notification.message}</strong>
              <br />
              <span>{new Date(notification.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications available.</p>
      )}

    </div>
  );
};

export default AllNotifications;
