import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function WelcomePage() {
  return (
    <Container className="welcome-container" maxWidth="sm">
      <Typography variant="h1" gutterBottom>
        Welcome to Our Pharmacy
      </Typography>
      <div className="buttons">
        <Link to="/choose-signup-type" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" size="large" style={{ marginRight: '16px' }}>
            Sign Up
          </Button>
        </Link>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <Button variant="outlined" color="primary" size="large">
            Log In
          </Button>
        </Link>
      </div>
    </Container>
  );
}

export default WelcomePage;
