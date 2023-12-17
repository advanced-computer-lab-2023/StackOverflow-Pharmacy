import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const RemovePharmacist = () => {
  const [pharmacistId, setPharmacistId] = useState('');

  const handleRemovePharmacist = async () => {
    const trimmedPharmacistId = pharmacistId.trim();

    if (trimmedPharmacistId === '') {
      alert('Please enter the Pharmacist ID.');
    } else {
      try {
        // Use the entered Pharmacist ID to send a request to remove the pharmacist
        const response = await fetch(`http://localhost:4000/admin/pharmacist/${trimmedPharmacistId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          // Handle the response as needed
          console.log('Pharmacist removed successfully.');
          alert('Pharmacist removed successfully.');
        } else {
          alert('Failed to remove pharmacist. Please try again.');
        }
      } catch (error) {
        console.error('Error removing pharmacist:', error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h5" gutterBottom>
          Remove Pharmacist
        </Typography>
        <div>
          <TextField
            label="Pharmacist ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={pharmacistId}
            onChange={(e) => setPharmacistId(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" onClick={handleRemovePharmacist}>
          Remove Pharmacist
        </Button>
      </Paper>
    </Container>
  );
};

export default RemovePharmacist;
