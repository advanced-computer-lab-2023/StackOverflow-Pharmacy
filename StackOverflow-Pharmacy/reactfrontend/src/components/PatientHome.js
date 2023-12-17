import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Grid, TextField, Container, Box } from '@mui/material';
import Cookies from 'js-cookie';

function PatientHome() {
  const [searchText, setSearchText] = useState('');
  const [filterText, setFilterText] = useState('');
  const [userData, setUserData] = useState({});
  const [patientData, setPatientData] = useState({});
  const navigate = useNavigate();

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get('jwt', { domain: 'localhost', path: '/' });
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const user = await response.json();
        console.log('User data:', user);
  
        setUserData(user);
        setPatientData({ name: user.username });
  
        const userId = user._id;
  
        const patientResponse = await fetch(`http://localhost:4000/api/patients/basic-info/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (patientResponse.status === 200) {
          const patientData = await patientResponse.json();
          console.log('Patient data:', patientData);
          setPatientData(patientData);
        } else {
          console.error('Error fetching patient data:', patientResponse.statusText);
        }
      } else {
        console.error('Error fetching user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleButtonClick = (action, param) => {
    switch (action) {
      case 'viewMedicines':
        navigate('/medicines');
        break;
      case 'search':
        handleSearch();
        break;
      case 'filter':
        handleFilter();
        break;
      case 'viewOrders':
        navigate('/orders');
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    const searchName = searchText.trim();

    if (searchName === '') {
      alert('Please enter a search term.');
    } else {
      fetch(`http://localhost:4000/api/patients/medicines/search?name=${encodeURIComponent(searchName)}`)
        .then((response) => response.json())
        .then((data) => {
          navigate('/search-results', { state: { results: data } });
        })
        .catch((error) => console.error('Error fetching data:', error));
    }
  };

  const handleFilter = () => {
    const filterTerm = filterText.trim();

    if (filterTerm === '') {
      alert('Please enter a filter term.');
    } else {
      navigate(`/filtered?medicalUse=${encodeURIComponent(filterTerm)}`);
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "cursive" }}>
        Welcome {patientData.name} !
      </Typography>
  
      <Box mb={3}>
        <Container>
          <Button variant="contained" color="primary" fullWidth onClick={() => handleButtonClick('viewMedicines')}>
            View Available Medicines
          </Button>
        </Container>
      </Box>
  
      <Box mb={3}>
        <Container>
          <Button variant="contained" color="primary" fullWidth onClick={() => handleButtonClick('viewOrders')}>
            View Orders
          </Button>
        </Container>
      </Box>
  
      <Box mb={3}>
        <Container>
          <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/add-prescription')}>
            Add Prescription
          </Button>
        </Container>
      </Box>
  
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6}>
          <Container>
            <TextField
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
            />
          </Container>
        </Grid>
  
        <Grid item xs={12} sm={6} md={6}>
          <Container>
            <Button variant="contained" color="primary" fullWidth onClick={() => handleButtonClick('search')}>
              Search for Medicine
            </Button>
          </Container>
        </Grid>
  
        <Grid item xs={12} sm={6} md={6}>
          <Container>
            <TextField
              fullWidth
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter"
            />
          </Container>
        </Grid>
  
        <Grid item xs={12} sm={6} md={6}>
          <Container>
            <Button variant="contained" color="primary" fullWidth onClick={() => handleButtonClick('filter')}>
              Filter Medicine
            </Button>
          </Container>
        </Grid>
      </Grid>
    </Container>
  );
  
}

export default PatientHome;