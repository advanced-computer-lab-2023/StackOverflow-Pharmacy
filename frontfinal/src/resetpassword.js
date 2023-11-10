import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  const [newUsername, setNewUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordChange = () => {
    // Check if new username is empty
    if (newUsername.trim() === '') {
      setErrorMessage('Username cannot be empty');
      return;
    }

    // Password validation criteria
    const hasUpperCase = /[A-Z]/.test(password1);
    const hasNumber = /\d/.test(password1);
    const isLengthValid = password1.length >= 8;

    // Check if passwords match and meet the validation criteria
    if (password1 === password2 && hasUpperCase && hasNumber && isLengthValid) {
      // Implement your password change logic here
      setErrorMessage('');
      setSuccessMessage('Password changed successfully');
    } else {
      setSuccessMessage('');
      setErrorMessage('Password does not meet the requirements');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Reset Password</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
        <label htmlFor="newUsername">New Username:</label>
        <input
          type="text"
          id="newUsername"
          placeholder="Enter new username"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
        />
        {errorMessage && <p style={{ fontSize: '12px', color: 'red', margin: '5px 0' }}>{errorMessage}</p>}
      </div>
      <p style={{ fontSize: '10px', color: '#555', marginBottom: '5px' }}>
          Password should contain at least one uppercase letter, one number, and be at least 8 characters long.
        </p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
        <label htmlFor="password1">New Password:</label>
        <input
          type="password"
          id="password1"
          placeholder="Enter new password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
        {errorMessage && !successMessage && <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>{errorMessage}</p>}
        
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
        <label htmlFor="password2">Confirm Password:</label>
        <input
          type="password"
          id="password2"
          placeholder="Confirm new password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
      </div>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <button
        style={{ backgroundColor: '#0074cc', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', margin: '10px 0', cursor: 'pointer' }}
        onClick={handlePasswordChange}
      >
        Change Password
      </button>
    </div>
  );
};

export default ResetPassword;
