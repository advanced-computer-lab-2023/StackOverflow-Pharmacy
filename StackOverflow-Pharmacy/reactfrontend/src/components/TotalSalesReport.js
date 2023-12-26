import React, { useState } from 'react';
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Typography, Box } from '@mui/material';
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
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Total Sales Report
      </Typography>

      <Box display="flex" alignItems="center" mb={2}>
        <Typography variant="body1" mr={2}>
          Select Month:
        </Typography>
        <Select
          value={chosenMonth}
          onChange={(e) => setChosenMonth(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Choose a month
          </MenuItem>
          {monthNames.map((month, index) => (
            <MenuItem key={index} value={index + 1}>
              {month}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={handleGenerateReport} disabled={loading} variant="contained" sx={{ ml: 2 }}>
          {loading ? <CircularProgress size={20} /> : 'View Sales'}
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ margin: '20px' }} />}

      {hasViewedSales && salesData.length === 0 && (
        <Typography variant="body1" className="no-sales-message">
          No Sales
        </Typography>
      )}

      {salesData.length > 0 && (
        <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medicine Name</TableCell>
                <TableCell>Quantity Sold</TableCell>
                <TableCell>Total Sales</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesData.map((item) => (
                <TableRow key={item.medicineId}>
                  <TableCell>{item.medicineName}</TableCell>
                  <TableCell>{item.quantitySold}</TableCell>
                  <TableCell>${item.totalSales.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

export default TotalSalesReport;
