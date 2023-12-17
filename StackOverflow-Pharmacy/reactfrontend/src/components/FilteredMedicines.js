import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function FilteredMedicines() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const medicalUse = query.get('medicalUse');

  // State to hold the filtered medicines
  const [filteredMedicines, setFilteredMedicines] = useState([]);

  useEffect(() => {
    // Fetch filtered medicines based on the 'medicalUse' parameter
    if (medicalUse) {
      fetch(`http://localhost:4000/api/patients/medicines/filter?medicalUse=${encodeURIComponent(medicalUse)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setFilteredMedicines(data);
        })
        .catch((error) => console.error('Error fetching filtered data:', error));
    }
  }, [medicalUse]);

  return (
    <div>
      <h1>Filtered Medicines</h1>
      {filteredMedicines.length > 0 ? (
        <ul>
          {filteredMedicines.map((medicine, index) => (
            <li key={index}>
              <h2>{medicine.name}</h2>
              <p>Description: {medicine.description}</p>
              <p>Price: ${medicine.price}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No medicines found with the provided filter term.</p>
      )}
    </div>
  );
}

export default FilteredMedicines;
