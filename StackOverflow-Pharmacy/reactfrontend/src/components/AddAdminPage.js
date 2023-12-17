import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const AddAdminPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAddAdmin = async () => {
    // Step 3: Send a POST request to add an admin
    const data = { userName: username, password: password };

    try {
      const response = await fetch('http://localhost:4000/admin/addadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('Admin added successfully!');
      } else {
        alert('Failed to add admin. Please try again.');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h5" gutterBottom>
          Add Admin
        </Typography>
        <div>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleAddAdmin}>
          Add Admin
        </Button>
      </Paper>
    </Container>
  );
};

export default AddAdminPage;
