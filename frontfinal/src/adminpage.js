import React, { useState } from 'react';
import styled from 'styled-components';

const PharmacistRequestView = () => {
  const [requestAccepted, setRequestAccepted] = useState(false);
  const [requestRejected, setRequestRejected] = useState(false);

  const handleAccept = () => {
    setRequestAccepted(true);
  };

  const handleReject = () => {
    setRequestRejected(true);
  };

  return (
    <Container>
      <h2>Pharmacist Request</h2>
      <p>Name: John Doe</p>
      <p>Qualifications: PharmD</p>

      {!requestAccepted && !requestRejected && (
        <ButtonContainer>
          <AcceptButton onClick={handleAccept}>Accept</AcceptButton>
          <RejectButton onClick={handleReject}>Reject</RejectButton>
        </ButtonContainer>
      )}

      {requestAccepted && <p>Request accepted!</p>}
      {requestRejected && <p>Request rejected!</p>}
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 8px;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
`;

const AcceptButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
`;

const RejectButton = styled.button`
  background-color: #f44336;
  color: white;
  padding: 10px 20px;
  border: none;
border-radius: 4px;
  cursor: pointer;
`;

export default PharmacistRequestView;