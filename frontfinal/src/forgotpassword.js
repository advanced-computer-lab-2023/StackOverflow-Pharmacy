import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  // State to manage the code input
  const [code, setCode] = useState('');
  // State to manage the email input
  const [email, setEmail] = useState('');
  // State to manage error message for email
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  // State to manage error message for code
  const [codeErrorMessage, setCodeErrorMessage] = useState('');

  // Function to handle code input change
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  // Function to handle email input change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Check if email is empty
    if (email.trim() === '') {
      setEmailErrorMessage('Email cannot be empty');
    } else {
      setEmailErrorMessage(''); // Clear any previous error message
      // Perform actions with the entered code and email, e.g., validate or process them
      console.log('Entered email:', email);
      console.log('Entered code:', code);
    }
  };

  // Function to handle entering the code
  const handleEnterCode = () => {
    // Check if code is empty
    if (code.trim() === '') {
      setCodeErrorMessage('Code cannot be empty');
    } else {
      setCodeErrorMessage(''); // Clear any previous error message
      // Perform actions with the entered code, e.g., validate or process it
      console.log('Entered code:', code);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <label style={{ backgroundColor: '#0074cc', color: '#fff', padding: '10px', borderRadius: '5px' }}>
        Enter your Email:
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>
      {emailErrorMessage && <p style={{ color: 'red' }}>{emailErrorMessage}</p>}
      <br />
      <button style={{ backgroundColor: '#0074cc', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer' }} onClick={handleSubmit}>
        Submit
      </button>
      <br />
      <br />
      <label style={{ backgroundColor: '#0074cc', color: '#fff', padding: '10px', borderRadius: '5px' }}>
        Enter the Code:
        <input type="text" value={code} onChange={handleCodeChange} />
      </label>
      {codeErrorMessage && <p style={{ color: 'red' }}>{codeErrorMessage}</p>}
      <br />
      <Link to="/resetpassword">
        <button style={{ backgroundColor: '#0074cc', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer' }} onClick={handleEnterCode}>
          Enter
        </button>
      </Link>
      <br />
    </div>
  );
};

export default ForgotPassword;
