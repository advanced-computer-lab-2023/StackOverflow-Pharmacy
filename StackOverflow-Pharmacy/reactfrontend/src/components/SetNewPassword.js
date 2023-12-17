// SetNewPassword.js
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SetNewPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSetNewPassword = async (e) => {
    e.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Send the new password and username to the server for update
    try {
      const searchParams = new URLSearchParams(location.search);
      const username = searchParams.get('username');
      console.log('Username:', username);

      const response = await fetch('http://localhost:4000/api/users/updatePassword', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),
      });

      console.log('Response from server:', response);

      if (response.status === 200) {
        // If password update is successful, navigate to a success page or login page
        navigate('/login');
      } else {
        // Handle password update failure
        console.error('Password update failed');
        // You may want to set an error state or display a message to the user
      }
    } catch (error) {
      console.error('Error during password update:', error);
    }
  };

  return (
    <div className="set-new-password-container">
      <h1>Set New Password</h1>
      {error && <p className="error-message">{error}</p>}
      <form className="set-new-password-form" onSubmit={handleSetNewPassword}>
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit" className="submit-button">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default SetNewPassword;
