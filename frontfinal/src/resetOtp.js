import React, { useState } from 'react';
import styled from 'styled-components';

const ResetPasswordView = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSendOtp = () => {
    // Code to send OTP to the provided email address
    setOtpSent(true);
  };

  return (
    <Container>
      <h2>Reset Password</h2>
      {!otpSent ? (
        <InputContainer>
          <InputLabel>Email:</InputLabel>
          <EmailInput
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email address"
          />
          <SendButton onClick={handleSendOtp}>Send</SendButton>
        </InputContainer>
      ) : (
        <p>OTP has been sent to your email address. Please check your inbox.</p>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InputLabel = styled.label`
  margin-right: 10px;
`;

const EmailInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-right: 10px;
`;

const SendButton = styled.button`
background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default ResetPasswordView;
