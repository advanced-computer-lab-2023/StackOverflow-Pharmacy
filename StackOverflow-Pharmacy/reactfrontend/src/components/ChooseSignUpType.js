import React from 'react';
import { Link } from 'react-router-dom';
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function ChooseSignUpType() {
  return (
    <Container
      className="choose-signup-container"
      maxWidth="xs"
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
  );
}

export default ChooseSignUpType;
