import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SignUpPharmacist() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [hourRate, setHourRate] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [educationBackground, setEducationBackground] = useState('');
  const [signUpStatus, setSignUpStatus] = useState({
    success: false,
    message: '',
  });

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      // Display an error toast for password validation
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:4000/api/users/pharmacistSignUp',
        {
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
        }
      );

      if (response.status === 201) {
        setSignUpStatus({ success: true, message: 'Sign-up successful' });
        toast.success(
          'Sign Up request was made, now upload your documents to approve your data!'
        );
        navigate('/upload-Documents');
      } else {
        const data = await response.json();
        setSignUpStatus({ success: false, message: data.message });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Container
      className="signup-pharmacist-container"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: 'cursive' }}>
        Sign Up as a Pharmacist
      </Typography>

      {signUpStatus.message && (
        <Alert
          severity={signUpStatus.success ? 'success' : 'error'}
          sx={{ width: '100%', mt: 2 }}
        >
          {signUpStatus.message}
        </Alert>
      )}

      <form onSubmit={handleSignUp}>
        {/* Include the following sx prop in each TextField to fix the border issue */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: '-8px' }}
        />

        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ marginBottom: '-8px' }}
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ marginBottom: '-8px' }}
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: '-8px' }}
        />

        <TextField
          label="Date of Birth"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          sx={{ marginBottom: '-8px' }}
        />

        <TextField
          label="Hourly Rate"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={hourRate}
          onChange={(e) => setHourRate(e.target.value)}
          sx={{ marginBottom: '-8px' }}
        />

        <TextField
          label="Affiliation (Hospital)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={affiliation}
          onChange={(e) => setAffiliation(e.target.value)}
          sx={{ marginBottom: '-8px' }}
        />

        <TextField
          label="Educational Background"
          variant="outlined"
          fullWidth
          margin="normal"
          value={educationBackground}
          onChange={(e) => setEducationBackground(e.target.value)}
          sx={{ marginBottom: '-8px' }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          Next Step
        </Button>
      </form>
    </Container>
  );
}

export default SignUpPharmacist;
