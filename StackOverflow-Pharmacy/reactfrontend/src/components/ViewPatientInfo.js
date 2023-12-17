import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const ViewPatientInfo = () => {
  const [patientId, setPatientId] = useState('');
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    const displayPatientInfo = async () => {
      const trimmedPatientId = patientId.trim();

      if (trimmedPatientId !== '') {
        try {
          const response = await fetch(`http://localhost:4000/admin/patient/basic-info/${trimmedPatientId}`);
          if (response.ok) {
            const data = await response.json();
            setPatientInfo(data);
          } else {
            console.error('Error fetching patient info:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching patient info:', error);
        }
      }
    };

    displayPatientInfo();
  }, [patientId]);

  const handleViewPatientInfo = () => {
    // You can choose to perform additional actions when the button is clicked
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h5" gutterBottom>
          Type the id of the Patient 
        </Typography>
        <div>
          <TextField
            label="Patient ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Patient ID"
          />
        </div>
        
        <div id="patientInfo" style={{ marginTop: '16px' }}>
          {patientInfo && (
            <div>
              <Typography>Name: {patientInfo.name}</Typography>
              <Typography>User Name: {patientInfo.username}</Typography>
              <Typography>Email: {patientInfo.email}</Typography>
              <Typography>Phone: {patientInfo.phone}</Typography>
            </div>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default ViewPatientInfo;
