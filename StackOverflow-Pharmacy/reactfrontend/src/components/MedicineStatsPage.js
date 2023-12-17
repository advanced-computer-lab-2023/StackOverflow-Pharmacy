import React, { useEffect, useState } from "react";
import "../styles/MedicineStats.css";

const MedicineStatsPage = () => {
  const [medicineStats, setMedicineStats] = useState([]);

  useEffect(() => {
    fetchMedicineStats();
  }, []);

  const fetchMedicineStats = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/pharmacists/medicines/stats");
      if (response.ok) {
        const data = await response.json();
        setMedicineStats(data);
      } else {
        console.error('Failed to fetch medicine stats');
      }
    } catch (error) {
      console.error('Error fetching medicine stats:', error);
    }
  };

  return (
    <div>
      <h1>Medicine Statistics</h1>
      <div className="medicine-stats">
        {medicineStats.map((medicineStat) => (
          <div key={medicineStat.name} className="medicine-stat-item">
            <h3>Medicine Name: {medicineStat.name}</h3>
            <p>Available Quantity: {medicineStat.availableQuantity}</p>
            <p>Total Sales: ${medicineStat.sales}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineStatsPage;
