// EditMedicinePage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

const EditMedicinePage = () => {
  const { medicineId } = useParams(); // Assuming you have a route parameter for medicineId

  const [medicine, setMedicine] = useState({
    name: "",
    description: "",
    price: "",
    numStock: "",
    numSold: "",
    medicalUse: "",
    activeIngredients: "",
    isArchived: "",
    isOverTheCounter: "",
    image: "",
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
        console.log("Medicine updated successfully:", data);
      })
      .catch(error => {
        console.error('Error updating medicine:', error);
      });
  };

  return (
    <main>
      <input type="text" id="name" placeholder="Name" onChange={handleChange} value={medicine.name} />
      <input type="text" id="description" placeholder="Description" onChange={handleChange} value={medicine.description} />
      <input type="text" id="price" placeholder="Price" onChange={handleChange} value={medicine.price} />
      <input type="text" id="numStock" placeholder="NumStock" onChange={handleChange} value={medicine.numStock} />
      <input type="text" id="numSold" placeholder="NumSold" onChange={handleChange} value={medicine.numSold} />
      <input type="text" id="medicalUse" placeholder="Medical Use" onChange={handleChange} value={medicine.medicalUse} />
      <input type="text" id="activeIngredients" placeholder="Active Ingredients" onChange={handleChange} value={medicine.activeIngredients} />
      <input type="text" id="isArchived" placeholder="Is Archived" onChange={handleChange} value={medicine.isArchived} />
      <input type="text" id="isOverTheCounter" placeholder="Is Over The Counter" onChange={handleChange} value={medicine.isOverTheCounter} />
      <input type="text" id="image" placeholder="Image" onChange={handleChange} value={medicine.image} />
      <Button className="dashboard-button" onClick={handleEditMedicine}>Edit Medicine</Button>
    </main>
  );
};

export default EditMedicinePage;
