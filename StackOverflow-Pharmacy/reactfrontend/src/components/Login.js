import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import '../styles/WelcomePage.css'; // Import your CSS file

function Login() {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showForgotPasswordLink, setShowForgotPasswordLink] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in...");

      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log("Response status:", response.status);

      if (response.status === 200) {
        const data = await response.json();
        const { role } = data;
        console.log("User role:", role);

        if (role === "Pharmacist") {
          navigate("/pharmacist-home");
        } else if (role === "Patient") {
          navigate("/patient-home");
        } else if (role === "Administrator") {
          navigate("/admin-home");
        }
      } else if (response.status === 401) {
        setError("Invalid password. Please try again.");
        setShowForgotPasswordLink(true);
      } else if (response.status === 404) {
        setError("User not found. Please register first.");
      } else if (response.status === 403) {
        const errorMessage = await response.text();
        setError(`Login failed: ${errorMessage}`);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Network or server error. Please try again later.");
    }
  };

  const handleForgotPassword = () => {
    // Navigate to the forgot password page with the username as a parameter
    navigate(`/forgot-password?username=${username}`);
  };

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
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form className="login-form" onSubmit={handleLogin}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          Log In
        </Button>
      </form>
      {showForgotPasswordLink && (
        <div className="forgot-password" style={{ textAlign: "center", marginTop: "16px" }}>
          <Link to={`/forgot-password?username=${username}`}>
            Forgot your password?
          </Link>
        </div>
        
      )}
    </Container>
    </div>
  );
}

export default Login;
