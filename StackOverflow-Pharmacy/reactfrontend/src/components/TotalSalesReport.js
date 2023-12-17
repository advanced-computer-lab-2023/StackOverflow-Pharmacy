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

function TotalSalesReport() {
  const [chosenMonth, setChosenMonth] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasViewedSales, setHasViewedSales] = useState(false);

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
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setSalesData(data.salesData);
        setHasViewedSales(true);
      } else {
        console.error('Error fetching total sales. Status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching total sales:', error);
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

      {hasViewedSales && salesData.length === 0 && (
        <p>No Sales</p>
      )}

      {salesData.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Quantity Sold</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((item) => (
              <tr key={item.medicineId}>
                <td>{item.medicineName}</td>
                <td>{item.quantitySold}</td>
                <td>${item.totalSales.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default TotalSalesReport;
