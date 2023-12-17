import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Alert } from '@mui/material';

function SetNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSetNewPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const searchParams = new URLSearchParams(location.search);
      const username = searchParams.get('username');

      const response = await fetch('http://localhost:4000/api/users/updatePassword', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),
      });

      if (response.status === 200) {
        navigate('/login');
      } else {
        setError('Password update failed');
        console.error('Password update failed');
      }
    } catch (error) {
      setError('Network or server error. Please try again later.');
      console.error('Error during password update:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Set New Password
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSetNewPassword} style={{ width: '300px', margin: 'auto' }}>
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="normal"
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          margin="normal"
          style={{ marginBottom: '16px' }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Update Password
        </Button>
      </form>
    </div>
  );
}

export default SetNewPassword;
