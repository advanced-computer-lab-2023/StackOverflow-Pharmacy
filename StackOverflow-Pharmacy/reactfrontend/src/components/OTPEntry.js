import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

    // Logging for debugging
    console.log("Email:", email); // Check if email is defined

    // Send the OTP to the server for verification
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
        // If OTP is verified successfully, navigate to the next step (set new password)
        navigate(
          `/set-new-password?username=${username}&email=${email}&otp=${enteredOtp}`
        );
      } else {
        // Log the response body for debugging purposes
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
    <div className="otp-entry-container">
      <h1>Enter OTP</h1>
      <form className="otp-entry-form" onSubmit={handleVerifyOTP}>
        <label>OTP</label>
        <input
          type="text"
          value={enteredOtp}
          onChange={(e) => setEnteredOtp(e.target.value)}
        />
        <button type="submit" className="submit-button">
          Verify OTP
        </button>
      </form>
    </div>
  );
}

export default OTPEntry;
