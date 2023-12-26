import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const RemovePatient = () => {
  const [patientId, setPatientId] = useState('');

  const handleRemovePatient = async () => {
    const trimmedPatientId = patientId.trim();

    if (trimmedPatientId === '') {
      alert('Please enter the Patient ID.');
    } else {
      try {
        // Use the entered Patient ID to send a request to remove the patient
        const response = await fetch(`http://localhost:4000/admin/patient/${trimmedPatientId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Handle the response as needed
          console.log('Patient removed successfully.');
          alert('Patient removed successfully.');
        } else {
          alert('Failed to remove patient. Please try again.');
        }
      } catch (error) {
        console.error('Error removing patient:', error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h5" gutterBottom>
          Remove Patient
        </Typography>
        <div>
          <TextField
            label="Patient ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleRemovePatient}>
          Remove Patient
        </Button>
      </Paper>
    </Container>
  );
};

export default RemovePatient;
