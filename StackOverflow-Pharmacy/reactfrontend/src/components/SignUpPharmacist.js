import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUpPharmacist() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [hourRate, setHourRate] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [educationBackground, setEducationBackground] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
    // Send a POST request to your server to sign up as a pharmacist
    const response = await fetch('http://localhost:4000/api/users/pharmacistSignUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        name,
        email,
        password,
        birthdate,
        role: 'Pharmacist',
        hourRate,
        affiliation,
        educationBackground,
      }),
    });

    if (response.status === 201) {
        // Sign-up successful
        navigate('/');
      } else {
        // Sign-up failed, parse and display the error message from the response
        const data = await response.json();
        setSignUpStatus({ success: false, message: data.message });
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle other errors here
    }
  };

  return (
    <div className="signup-pharmacist-container">
      <h1>Sign Up as a Pharmacist</h1>
      <form className="signup-pharmacist-form" onSubmit={handleSignUp}>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Date of Birth</label>
        <input
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
        />
        <label>Hourly Rate</label>
        <input
          type="number"
          value={hourRate}
          onChange={(e) => setHourRate(e.target.value)}
        />
        <label>Affiliation (Hospital)</label>
        <input
          type="text"
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
        />
        <label>Educational Background</label>
        <input
          type="text"
          value={educationBackground}
          onChange={(e) => setEducationBackground(e.target.value)}
        />
        <button type="submit" className="signup-pharmacist-button">
          Sign Up
        </button>
      </form>
     
    </div>
  );
}

export default SignUpPharmacist;
