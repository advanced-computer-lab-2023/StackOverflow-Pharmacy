import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Paper,
  CircularProgress,
  List,
  ListItem,
} from '@mui/material';

const useStyles = {
  root: {
    width: '100%',
    maxWidth: 600,
    margin: 'auto',
    marginTop: 16,
  },
  paper: {
    padding: 16,
  },
  listItem: {
    borderBottom: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
  },
};

function Request() {
  const [pharmacists, setPharmacists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get('jwt', { domain: 'localhost', path: '/' });
    console.log('Auth token:', authToken);
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching pharmacists...');
      try {
        const response = await fetch('http://localhost:4000/admin/viewPharmacist', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          const data = await response.json();
          setPharmacists(data);
        } else {
          console.error('Error fetching pharmacists:', response.statusText);
          setPharmacists([]);
        }
      } catch (error) {
        console.error('Error fetching pharmacists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [authToken]);

  const removePharmacistFromList = (pharmacistId) => {
    setPharmacists((prevPharmacists) =>
      prevPharmacists.filter(
        (pharmacist) => pharmacist._id !== pharmacistId
      )
    );
  };

  const rejectRequest = (pharmacistId) => {
    console.log('Rejecting pharmacist with ID:', pharmacistId);
    // Send a request to reject the pharmacist
    fetch(`http://localhost:4000/admin/reject/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the user's JWT token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pharmacistId }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Update local state immediately after successful request
          removePharmacistFromList(pharmacistId);
        } else {
          console.error('Error rejecting pharmacist:', response.statusText);
        }
      })
      .catch((error) => console.error('Error rejecting pharmacist:', error));
  };

  const acceptRequest = (pharmacistId) => {
    console.log('Accepting pharmacist with ID:', pharmacistId);
    // Send a request to accept the pharmacist
    fetch(`http://localhost:4000/admin/accept/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the user's JWT token
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pharmacistId }),
    })
      .then((response) => {
        if (response.status === 200) {
          // Update local state immediately after successful request
          removePharmacistFromList(pharmacistId);
        } else {
          console.error('Error accepting pharmacist:', response.statusText);
        }
      })
      .catch((error) => console.error('Error accepting pharmacist:', error));
  };

  return (
    <div style={useStyles.root}>
      <Paper style={useStyles.paper} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Pharmacist Requests
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : pharmacists.length === 0 ? (
          <Typography>No Requests.</Typography>
        ) : (
          <List>
            {pharmacists.map((pharmacist) => (
              <ListItem key={pharmacist._id} style={useStyles.listItem}>
                <div>
                  <Typography variant="h6" gutterBottom>
                    Pharmacist Username: {pharmacist.name}
                  </Typography>
                  <Typography>
                    Pharmacist Education Background: {pharmacist.educationBackground}
                  </Typography>
                </div>
                {pharmacist.status === 'Pending' && (
                  <div>
                    <Button variant="contained" color="primary" onClick={() => acceptRequest(pharmacist._id)}>
                      Accept
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => rejectRequest(pharmacist._id)}>
                      Reject
                    </Button>
                  </div>
                )}
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
}

export default Request;
