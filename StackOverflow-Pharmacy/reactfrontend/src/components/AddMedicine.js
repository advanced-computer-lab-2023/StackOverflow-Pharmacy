import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
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
    <div className="add-medicine-container">
      <h1>Add Medicine</h1>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={medicine.name}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={medicine.description}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="price"
        placeholder="Price"
        value={medicine.price}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="numStock"
        placeholder="Number in Stock"
        value={medicine.numStock}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="numSold"
        placeholder="Number Sold"
        value={medicine.numSold}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="medicalUse"
        placeholder="Medical Use"
        value={medicine.medicalUse}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="activeIngredients"
        placeholder="Active Ingredients"
        value={medicine.activeIngredients}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="isArchived"
        placeholder="Is Archived"
        value={medicine.isArchived}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="isOverTheCounter"
        placeholder="Is Over The Counter"
        value={medicine.isOverTheCounter}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={medicine.image}
        onChange={handleInputChange}
      />
      <Button onClick={handleAddMedicine}>Add Medicine</Button>
    </div>
  );
};

export default AddMedicine;
