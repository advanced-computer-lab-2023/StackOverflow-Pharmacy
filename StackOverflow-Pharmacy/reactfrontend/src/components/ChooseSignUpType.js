import React from 'react';
import { Link } from 'react-router-dom';

function ChooseSignUpType() {
  return (
    <div className="choose-signup-container"> {/* Apply the styles */}
      <h1>Choose Your Signup Type</h1>
      <div className="signup-options">
        <Link to="/signup/patient">
          <button className="patient-signup-button">Sign Up as a Patient</button>
        </Link>
        <Link to="/signup/pharmacist">
          <button className="pharmacist-signup-button">Sign Up as a Pharmacist</button>
        </Link>
      </div>
    </div>
  );
}

export default ChooseSignUpType;
