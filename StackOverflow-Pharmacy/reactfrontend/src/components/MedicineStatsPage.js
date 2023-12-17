import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import '../styles/MedicineStats.css';

const MedicineStatsPage = () => {
  const [medicineStats, setMedicineStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMedicineStats();
  }, []);

  const fetchMedicineStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/pharmacists/medicines/stats');

      if (response.ok) {
        const data = await response.json();
        setMedicineStats(data);
      } else {
        setError('Failed to fetch medicine stats');
      }
    } catch (error) {
      setError('Error fetching medicine stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Medicine Statistics
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {!loading && !error && (
        <div className="medicine-stats">
          {medicineStats.map((medicineStat) => (
            <div key={medicineStat.name} className="medicine-stat-item">
              <Typography variant="h5" gutterBottom>
                Medicine Name: {medicineStat.name}
              </Typography>
              <Typography variant="body1">Available Quantity: {medicineStat.availableQuantity}</Typography>
              <Typography variant="body1">Total Sales: ${medicineStat.sales}</Typography>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default MedicineStatsPage;
