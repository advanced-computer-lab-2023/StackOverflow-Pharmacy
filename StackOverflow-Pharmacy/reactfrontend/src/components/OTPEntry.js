import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Typography, Alert } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OTPEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const [enteredOtp, setEnteredOtp] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const usernameParam = searchParams.get("username");
    const emailParam = searchParams.get("email");

    if (usernameParam && emailParam) {
      setUsername(usernameParam);
      setEmail(emailParam);
    }
  }, [location.search]);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/users/checkOTP", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, otp: enteredOtp }),
      });

      if (response.status === 200) {
        navigate(
          `/set-new-password?username=${username}&email=${email}&otp=${enteredOtp}`
        );
      } else {
        toast.error("Invalid or expired OTP.");
        const responseBody = await response.json();
        console.error("Invalid or expired OTP. Response:", responseBody);
        return;
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Enter OTP
      </Typography>
      <form onSubmit={handleVerifyOTP} style={{ width: "300px", margin: "auto" }}>
        <TextField
          label="OTP"
          type="text"
          value={enteredOtp}
          onChange={(e) => setEnteredOtp(e.target.value)}
          fullWidth
          margin="normal"
          style={{ marginBottom: "16px" }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Verify OTP
        </Button>
      </form>
    </div>
  );
}

export default OTPEntry;
