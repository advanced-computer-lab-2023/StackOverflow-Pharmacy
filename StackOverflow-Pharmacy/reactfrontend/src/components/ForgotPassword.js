import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { TextField, Button, Typography, Alert } from '@mui/material';

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [username, setUsername] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, [location.search]);

  const handleForgotPassword = async (e) => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/users/forgotPassword', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username }),
      });

      if (response.status === 200) {
        setSuccessMessage('Password reset OTP sent successfully. Check your email.');
        setOtpSent(true);
      } else if (response.status === 404) {
        setError('User not found. Please check your email and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error during forgot password:', error);
      setError('Network or server error. Please try again later.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {!otpSent && (
        <div style={{ width: '300px', margin: 'auto' }}>
          <form onSubmit={handleForgotPassword}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              style={{ marginBottom: '16px' }}
            />
            <Button type="submit" variant="contained" color="primary">
              Send OTP
            </Button>
          </form>
        </div>
      )}
      {otpSent && (
        <div style={{ width: '300px', margin: 'auto', marginTop: '16px' }}>
          <Link to={`/verify-otp?username=${username}&email=${email}`}>
            <Button variant="contained" color="primary" style={{ width: '100%' }}>
              Enter OTP
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
