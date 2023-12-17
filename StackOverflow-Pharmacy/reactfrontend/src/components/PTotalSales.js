import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import Cookies from 'js-cookie';
import '../styles/total-sales-report.css';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function PTotalSales() {
  const [chosenMonth, setChosenMonth] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [filteredSalesData, setFilteredSalesData] = useState([]); // Add state for filtered data
  const [loading, setLoading] = useState(false);
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [hasViewedSales, setHasViewedSales] = useState(false);
  const [, forceUpdate] = useState(); // Add forceUpdate state

  // Filter options state
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get('jwt', { domain: 'localhost', path: '/' });
    console.log('Auth token:', authToken);
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

  const handleGenerateReport = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:4000/api/pharmacists/total-sales/${chosenMonth}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setIsDataAvailable(data.salesData.length > 0);
        setSalesData(data.salesData);
        setHasViewedSales(true);
      } else {
        console.error("Error fetching total sales. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching total sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:4000/api/pharmacists/total-sales/${chosenMonth}/${selectedDate}/${selectedMedicine}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setIsDataAvailable(data.salesData.length > 0);
        // Set both salesData and filteredSalesData to null if the response is empty
        if (data.salesData.length === 0) {
          setSalesData(null);
          setFilteredSalesData(null);
        } else {
          setFilteredSalesData(data.salesData);
        }
      } else {
        console.error(
          "Error fetching filtered sales. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching filtered sales:", error);
    } finally {
      setLoading(false);
    }
  };

  
  
  

  return (
    <div>
      <h1>Total Sales Report</h1>
      <label>Select Month:</label>
      <select
        value={chosenMonth}
        onChange={(e) => setChosenMonth(e.target.value)}
      >
        <option value="" disabled>
          Choose a month
        </option>
        {monthNames.map((month, index) => (
          <option key={index} value={index + 1}>
            {month}
          </option>
        ))}
      </select>
      <Button onClick={handleGenerateReport} disabled={loading}>
        View Sales
      </Button>
  
      {loading && <p>Loading...</p>}

      {hasViewedSales && salesData === null && <p>No Sales</p>}

      {salesData !== null && salesData.length > 0 && (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
               {(filteredSalesData.length > 0 ? filteredSalesData : salesData).map((item) => (
                <tr key={item.medicineId}>
                  <td>{item.medicineName}</td>
                  <td>{item.quantitySold}</td>
                  <td>${item.totalSales.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
  
          {/* Filter options */}
          <label>Select Medicine:</label>
          <input
            type="text"
            value={selectedMedicine}
            onChange={(e) => setSelectedMedicine(e.target.value)}
          />
  
          <label>Select Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
  
          {/* Add a button to trigger the filtering */}
          <Button onClick={handleFilter} disabled={loading}>
            Apply Filter
          </Button>
          {filteredSalesData === null && (
            <p>No sales match the selected criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PTotalSales;
