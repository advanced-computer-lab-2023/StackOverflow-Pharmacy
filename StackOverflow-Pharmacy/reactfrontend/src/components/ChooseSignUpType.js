import React from 'react';
import { Link } from 'react-router-dom';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function ChooseSignUpType() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundImage: 'url("../images/backg.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>

    <Container
      className="login-container"
      maxWidth="xs"
      style={{
        backgroundColor: 'rgba(245, 245, 245, 0.9)', // Background color with opacity
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
        textAlign: 'center',
        transform: 'translateY(-120px)', // Adjust the translation as needed
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "cursive" }}>
        Choose Your role
      </Typography>
      <div className="signup-options" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Link to="/signup/patient">
          <Button variant="contained" color="primary" fullWidth>
            Sign Up as a Patient
          </Button>
        </Link>
        <Link to="/signup/pharmacist">
          <Button variant="contained" color="primary" fullWidth>
            Sign Up as a Pharmacist
          </Button>
        </Link>
      </div>
    </Container>
    </div>
  );
}

export default ChooseSignUpType;
