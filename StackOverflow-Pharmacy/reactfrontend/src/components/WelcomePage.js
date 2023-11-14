import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div className="welcome-container">
      <h1>Welcome to Our Pharmacy</h1>
      <div className="buttons">
        <Link to="/choose-signup-type">
          <button className="signup-button">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="login-button">Log In</button>
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
