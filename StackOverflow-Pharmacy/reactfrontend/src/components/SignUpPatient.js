import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPatient() {
  const navigate = useNavigate();

  // State variables for form data, emergency contacts, and sign-up status
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    birthdate: '',
    gender: 'male',
    phone: '',
    emergencyContacts: [],
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    phone: '',
    relation: '',
  });

  const [signUpStatus, setSignUpStatus] = useState({ success: false, message: '' });

  const addEmergencyContact = () => {
    if (emergencyContact.name && emergencyContact.phone && emergencyContact.relation) {
      setFormData({
        ...formData,
        emergencyContacts: [...formData.emergencyContacts, emergencyContact],
      });
      setEmergencyContact({
        name: '',
        phone: '',
        relation: '',
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:4000/api/users/PatientSignUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        // Sign-up successful
        setSignUpStatus({ success: true, message: 'Sign-up successful' });
        navigate('/signup-success');
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
    <div className="signup-patient-container">
      <h1>Sign Up as a Patient</h1>
      {/* Conditional rendering of the sign-up status message */}
      {signUpStatus.message && (
        <div className={signUpStatus.success ? 'success-message' : 'error-message'}>
          {signUpStatus.message}
        </div>
      )}

      <form className="signup-patient-form" onSubmit={handleFormSubmit}>
                <label>Username</label>
                <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />

                <label>Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <label>Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <label>Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <label>Date of Birth</label>
                <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                />

                <label>Gender</label>
                <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>

                <label>Mobile Number</label>
                <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <h2>Emergency Contacts</h2>
                <div className="emergency-contact-list">
                    {formData.emergencyContacts.map((contact, index) => (
                        <div key={index} className="emergency-contact-item">
                            <p>Name: {contact.name}</p>
                            <p>Phone: {contact.phone}</p>
                            <p>Relation: {contact.relation}</p>
                        </div>
                    ))}
                </div>

                <div className="emergency-contact-form">
                    <label>Name</label>
                    <input
                        type="text"
                        value={emergencyContact.name}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                    />

                    <label>Phone</label>
                    <input
                        type="text"
                        value={emergencyContact.phone}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                    />

                    <label>Relation</label>
                    <input
                        type="text"
                        value={emergencyContact.relation}
                        onChange={(e) => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
                    />

                    <button type="button" onClick={addEmergencyContact}>Add Contact</button>
                </div>

                <button type="submit" className="signup-button">
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignUpPatient;
