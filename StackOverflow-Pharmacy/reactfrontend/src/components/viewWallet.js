import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Paper, Box } from '@mui/material';
import '../styles/MainComponent.css';

const Wallet = () => {
  const [wallet, setWallet] = useState('');
  const [firstID, setFirstID] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get user ID
      try {
        const response = await fetch("http://localhost:4000/api/users/profile", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFirstID(data._id);
        } else {
          console.error('Error fetching user profile. Status:', response.status);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }

      // Get wallet balance
      try {
        if (firstID) {
          const response = await fetch(`http://localhost:4000/api/users/getWallet?firstID=${firstID}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const walletBalance = data.wallet;
            setWallet(walletBalance);
          } else {
            console.error('Error fetching wallet balance. Status:', response.status);
          }
        }
      } catch (error) {
        console.error('Error getting wallet balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [firstID]);

  return (
    <Container>
      <Paper elevation={3} className="main-container">
        <Box p={3} textAlign="center">
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                My Wallet
              </Typography>
              <Typography variant="h4">${wallet}</Typography>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Wallet;
