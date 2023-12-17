import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';

const ViewPharmacistInfo = () => {
  const [pharmacistId, setPharmacistId] = useState('');
  const [pharmacistInfo, setPharmacistInfo] = useState(null);

  useEffect(() => {
    const displayPharmacistInfo = async () => {
      const trimmedPharmacistId = pharmacistId.trim();

      if (trimmedPharmacistId !== '') {
        try {
          const response = await fetch(`http://localhost:4000/admin/pharmacist/${trimmedPharmacistId}`);
          if (response.ok) {
            const data = await response.json();
            setPharmacistInfo(data);
          } else {
            console.error('Error fetching pharmacist info:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching pharmacist info:', error);
        }
      }
    };

    displayPharmacistInfo();
  }, [pharmacistId]);

  const handleViewPharmacistInfo = () => {
    // You can choose to perform additional actions when the button is clicked
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
        <Typography variant="h5" gutterBottom>
        Type the id of the pharmacist
        </Typography>
        <div>
          <TextField
            label="Pharmacist ID"
            variant="outlined"
            fullWidth
            margin="normal"
            value={pharmacistId}
            onChange={(e) => setPharmacistId(e.target.value)}
            placeholder="Pharmacist ID"
          />
        </div>
        
        <div id="pharmacistInfo" style={{ marginTop: '16px' }}>
          {pharmacistInfo && (
            <div>
              <Typography>Name: {pharmacistInfo.name}</Typography>
              <Typography>Hour Rate: {pharmacistInfo.hourRate}</Typography>
              <Typography>Affiliation: {pharmacistInfo.affiliation}</Typography>
              <Typography>Education Background: {pharmacistInfo.educationBackground}</Typography>
              <Typography>Email: {pharmacistInfo.email}</Typography>
            </div>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default ViewPharmacistInfo;
