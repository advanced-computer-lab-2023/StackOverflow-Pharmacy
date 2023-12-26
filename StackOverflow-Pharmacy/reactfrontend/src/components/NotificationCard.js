// NotificationCard.js
import React from "react";
import { Card, Typography } from "@mui/material";

const NotificationCard = ({ notification }) => {
  return (
    <Card variant="outlined" style={{ marginBottom: "15px" }}>
      <Card.Content>
        <Typography variant="h6">{notification.message}</Typography>
        <Typography>{new Date(notification.timestamp).toLocaleString()}</Typography>
      </Card.Content>
    </Card>
  );
};

export default NotificationCard;
