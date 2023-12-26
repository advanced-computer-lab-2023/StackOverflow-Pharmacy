import React, { useState } from 'react';
import { Button, TextField, Typography, Box } from '@mui/material';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get('jwt', { domain: 'localhost', path: '/' });
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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      toast.error(
        'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit. Minimum length is 8 characters.'
      );
      return;
    }

    const userId = await getUserId();

    try {
      const response = await fetch(`http://localhost:4000/api/users/changePassword/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (response.status === 200) {
        console.log('Password changed successfully');
        toast.success('Password changed successfully');
      } else if (response.status === 401) {
        console.error('Invalid old password');
        toast.error('Invalid old password');
      } else {
        console.error('Error changing password');
        toast.error('Error changing password');
      }
    } catch (error) {
      console.error('Error during password change:', error);
    }
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Change Password
      </Typography>
      <form onSubmit={handleChangePassword}>
        <TextField
          label="Old Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ marginTop: '20px' }}>
          Change Password
        </Button>
      </form>
      <ToastContainer />
    </Box>
  );
}

export default ChangePassword;
