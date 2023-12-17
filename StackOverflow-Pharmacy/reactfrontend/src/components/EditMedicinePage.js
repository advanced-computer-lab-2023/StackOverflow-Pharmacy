import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, TextField, Container, Typography, Box } from '@mui/material';

const EditMedicinePage = () => {
  const { medicineId } = useParams(); // Assuming you have a route parameter for medicineId

  const [medicine, setMedicine] = useState({
    name: '',
    description: '',
    price: '',
    numStock: '',
    numSold: '',
    medicalUse: '',
    activeIngredients: '',
    isArchived: '',
    isOverTheCounter: '',
    image: '',
  });

  useEffect(() => {
    // Fetch medicine details using the medicineId
    fetch(`http://localhost:4000/api/pharmacists/medicines/${medicineId}`)
      .then(response => response.json())
      .then(data => {
        // Update state with fetched medicine details
        setMedicine(data);
      })
      .catch(error => {
        console.error('Error fetching medicine details:', error);
      });
  }, [medicineId]);

  const handleChange = (e) => {
    setMedicine({
      ...medicine,
      [e.target.id]: e.target.value,
    });
  };

  const handleEditMedicine = () => {
    // Send a PUT request to update the medicine details
    fetch(`http://localhost:4000/api/pharmacists/medicines/edit/${medicineId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ medicine }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Medicine updated successfully:', data);
      })
      .catch(error => {
        console.error('Error updating medicine:', error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()} // Prevent default form submission
      >
         <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "cursive" }}>
          Edit Medicine
        </Typography>
        <TextField
          fullWidth
          id="name"
          label="Name"
          value={medicine.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="description"
          label="Description"
          value={medicine.description}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="price"
          label="Price"
          value={medicine.price}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="numStock"
          label="NumStock"
          value={medicine.numStock}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="numSold"
          label="NumSold"
          value={medicine.numSold}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="medicalUse"
          label="Medical Use"
          value={medicine.medicalUse}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="activeIngredients"
          label="Active Ingredients"
          value={medicine.activeIngredients}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="isArchived"
          label="Is Archived"
          value={medicine.isArchived}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="isOverTheCounter"
          label="Is Over The Counter"
          value={medicine.isOverTheCounter}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          id="image"
          label="Image"
          value={medicine.image}
          onChange={handleChange}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleEditMedicine}>
          Edit Medicine
        </Button>
      </Box>
    </Container>
  );
};

export default EditMedicinePage;
