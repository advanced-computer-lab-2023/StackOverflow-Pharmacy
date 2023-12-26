import React, { useState } from 'react';
import {
  Button,
  Table,
  TextField,
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
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
  const [filteredSalesData, setFilteredSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [hasViewedSales, setHasViewedSales] = useState(false);

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
        setIsDataAvailable(data.salesData.length > 0);
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

  const handleFilter = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:4000/api/pharmacists/total-sales/${chosenMonth}/${selectedDate}/${selectedMedicine}`,
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
        setIsDataAvailable(data.salesData.length > 0);
        setFilteredSalesData(data.salesData);
      } else {
        console.error('Error fetching filtered sales. Status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching filtered sales:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Box mt={3}>
        <Typography variant="h4" gutterBottom>
          Total Sales Report
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select Month</InputLabel>
            <Select
              value={chosenMonth}
              onChange={(e) => setChosenMonth(e.target.value)}
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
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            onClick={handleGenerateReport}
            disabled={loading}
            fullWidth
          >
            View Sales
          </Button>
        </Grid>
      </Grid>

      {loading && (
        <Box mt={3}>
          <CircularProgress />
        </Box>
      )}

      {hasViewedSales && salesData === null && (
        <Box mt={3}>
          <Typography>No Sales</Typography>
        </Box>
      )}

      {salesData !== null && salesData.length > 0 && (
        <Box mt={3}>
          <Paper elevation={3}>
            <Table>
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
          </Paper>

          {/* Filter options */}
          <Grid container spacing={3} mt={3}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Select Medicine"
                value={selectedMedicine}
                onChange={(e) => setSelectedMedicine(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                type="date"
                label="Select Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                onClick={handleFilter}
                disabled={loading}
                fullWidth
              >
                Apply Filter
              </Button>
            </Grid>
          </Grid>

          {filteredSalesData === null && (
            <Box mt={3}>
              <Typography>No sales match the selected criteria.</Typography>
            </Box>
          )}
        </Box>
      )}
    </Container>
  );
}

export default PTotalSales;
