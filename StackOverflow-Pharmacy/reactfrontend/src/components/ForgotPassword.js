// Import necessary components and hooks
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [username, setUsername] = useState('');
  const [otpSent, setOtpSent] = useState(false); // New state to track OTP sent status

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const usernameParam = searchParams.get('username');
    if (usernameParam) {
      setUsername(usernameParam);
    }
  }, [location.search]);

  const handleForgotPassword = async (e) => {
    if (!email) {
        alert('please enter your email');
        return;
      }
    e.preventDefault();
    try {
      console.log('Sending forgot password request for email:', email, 'and username:', username);
  
      const response = await fetch('http://localhost:4000/api/users/forgotPassword', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username }),
      });
  
      console.log('Received response from server:', response);
  
      if (response.status === 200) {
        setSuccessMessage('Password reset OTP sent successfully. Check your email.');
        setOtpSent(true); // Update state to indicate OTP is sent
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

  // Check if the error is "User not found" before rendering the form
  const shouldRenderForm = !error || error !== 'User not found';

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      {error && error === 'User not found' && (
        <p className="error-message">{error}</p>
      )}
      {successMessage && <p className="success-message">{successMessage}</p>}
      {shouldRenderForm && !otpSent && (
        <form className="forgot-password-form" onSubmit={handleForgotPassword}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="submit-button">
            Send OTP
          </button>
        </form>
      )}
      {otpSent && (
        <Link to={`/verify-otp?username=${username}&email=${email}`}>
          {/* You can use a button or link to navigate to the OTP entry page */}
          <button className="submit-button">Enter OTP</button>
        </Link>
      )}
    </div>
  );
}

export default ForgotPassword;
