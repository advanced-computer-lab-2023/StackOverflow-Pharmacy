import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import patientpage from './patientpage';
export default function Home(){  

  
   return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Admin Login Form</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" placeholder="Enter your username" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" placeholder="Enter your password" />
        </div>
      </div>
      <div style={{ display: 'flex' }}>
      <Link to="/adminpage">
        <button style={{ backgroundColor: '#0074cc', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', margin: '0 10px', cursor: 'pointer' }}>Login</button>
        </Link>
        <Link to="/resetpassword">
          <button style={{ backgroundColor: '#0074cc', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', margin: '0 10px', cursor: 'pointer' }}>Forgot Password</button>
        </Link>
      </div>
    </div>
  );
    
}