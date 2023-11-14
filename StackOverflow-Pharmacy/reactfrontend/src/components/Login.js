import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Logging in...'); // Add a log here to check if the function is called

      const response = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status); // Log the response status

      if (response.status === 200) {
        const data = await response.json();
        const { role } = data;
        console.log('User role:', role); // Log the user's role

        if (role === 'Pharmacist') {
          navigate('/pharmacist-home');
        } else if (role === 'Patient') {
          navigate('/patient-home');
        } else if (role === 'Administrator') {
          navigate('/admin-home');
        }
      } else if (response.status === 401) {
        setError('Invalid password. Please try again.');
      } else if (response.status === 404) {
        setError('User not found. Please register first.');
      } else if (response.status === 403) {
        const errorMessage = await response.text();
        setError(`Login failed: ${errorMessage}`);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error during login:', error); // Log any error that occurs
      setError('Network or server error. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>} {/* Display the error message */}
      <form className="login-form" onSubmit={handleLogin}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-button">
          Log In
        </button>
      </form>
      <div className="forgot-password">
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
    </div>
  );
}

export default Login;
