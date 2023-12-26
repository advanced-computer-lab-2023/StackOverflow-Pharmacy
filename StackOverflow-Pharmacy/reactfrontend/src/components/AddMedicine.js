import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../styles/AddMedicine.css";

const AddMedicine = () => {
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

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicine((prevMedicine) => ({
      ...prevMedicine,
      [name]: value,
    }));
  };

  const handleAddMedicine = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/pharmacists/addmedicine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ medicine }),
      });

      if (response.status === 201) {
        console.log('Medicine added successfully');
        // Redirect to the pharmacist home page or another appropriate page
        navigate('/pharmacist-home');
      } else {
        console.error('Failed to add medicine:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        className="add-medicine-container"
        component="form"
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()} // Prevent default form submission
      >
         <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "cursive" }}>
          Add Medicine
        </Typography>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={medicine.name}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={medicine.description}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Price"
          name="price"
          value={medicine.price}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Number in Stock"
          name="numStock"
          value={medicine.numStock}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Number Sold"
          name="numSold"
          value={medicine.numSold}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Medical Use"
          name="medicalUse"
          value={medicine.medicalUse}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Active Ingredients"
          name="activeIngredients"
          value={medicine.activeIngredients}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Is Archived"
          name="isArchived"
          value={medicine.isArchived}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Is Over The Counter"
          name="isOverTheCounter"
          value={medicine.isOverTheCounter}
          onChange={handleInputChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Image URL"
          name="image"
          value={medicine.image}
          onChange={handleInputChange}
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleAddMedicine}>
          Add Medicine
        </Button>
      </Box>
    </Container>
  );
};

export default AddMedicine;
