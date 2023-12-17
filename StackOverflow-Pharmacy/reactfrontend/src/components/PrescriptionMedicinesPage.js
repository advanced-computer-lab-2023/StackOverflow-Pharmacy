import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  Modal } from "react-bootstrap";
import {
  Button,
  Container,
  Typography,
  Paper, Grid,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";

function PrescriptionMedicinesPage() {
  const { userId } = useParams();
  const [prescriptionMedicines, setPrescriptionMedicines] = useState([]);
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);
  const [alternativeTooltip, setAlternativeTooltip] = useState(null);
  const [userrId, setUserId] = useState("");

  const navigate = useNavigate();

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
  };
  const authToken = getAuthTokenFromCookie();
  async function getUserId() {
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
        return user._id;
      } else {
        console.error("Error fetching user profile:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  }
  useEffect(() => {
    // Fetch prescription medicines when the component mounts
    fetchPrescriptionMedicines();
  }, [userId]); // Include userId in the dependency array

  const fetchPrescriptionMedicines = async () => {
    // Fetch prescription medicines from the backend
    try {
      const response = await fetch(
        `http://localhost:4000/api/patients/prescriptionMedicines/${userId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
        setPrescriptionMedicines(data);
      } else {
        console.error(
          "Error fetching prescription medicines. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching prescription medicines:", error);
    }
  };

  const renderAlternativeTooltip = (alternatives) => {
    if (!alternatives || alternatives.length === 0) {
      return null;
    }

    return (
      <div>
        {alternatives.length === 0 ? (
          <p>No alternatives available.</p>
        ) : (
          <div className="medicine-list">
            {alternatives.map((alternative) => (
              <div key={alternative._id} className="medicine-item">
                <img
                  className="medicine-image"
                  src={alternative.image}
                  alt={alternative.name}
                />
                <Typography variant="h5">{alternative.name}</Typography>
                <Typography>Price: ${alternative.price}</Typography>
                <Typography>Description: {alternative.description}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className="add-to-cart-button"
                  onClick={() => handleAlternativeClick(alternative)}
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
    
  };
  const handleAlternativeClick = (alternative) => {
    // Add alternative to the cart or handle as needed
    addToCart(alternative._id.toString());
  };
  const addToCart = async (medicineId) => {
    try {
      if (!authToken) {
        console.log("User is not authenticated. Showing login message.");
      }

      console.log("Adding medicine to cart...");
      const response = await fetch(
        `http://localhost:4000/api/patients/medicines/cart/${medicineId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Medicine added to the cart!");
      } else {
        console.error(
          "Error adding medicine to cart. Status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error adding medicine to cart:", error);
    }
  };
 
  const handleViewCartClick = async () => {
    try {
      const fetchedUserId = await getUserId();

      if (fetchedUserId) {
        setUserId(fetchedUserId);
        navigate(`/viewCart/${fetchedUserId}`);
      } else {
        // Handle the case where user ID could not be fetched
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      // Handle the error as needed
    }
  };
  const handleViewAlternativesClick = async (medicineId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/patients/alternativeMedicines/${medicineId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const alternatives = await response.json();
        if (alternatives.length === 0) {
          // If no alternatives, show a message to the user
          toast.info("No alternatives available for this medicine.");
        } else {
          setAlternativeTooltip(alternatives);
          setShowAlternativesModal(true);
        }
      } else if (response.status === 404) {
        // If alternatives not found, show a message to the user
        toast.info("No alternatives found for this medicine.");
      } else {
        console.error("Error fetching alternatives. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching alternatives:", error);
    }
  };
  const handleCloseAlternativesModal = () => {
    setShowAlternativesModal(false);
    setAlternativeTooltip(null);
  };
  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontFamily: "cursive" }}
      >
        Prescription Medicines
      </Typography>
      <main>
        <Grid container spacing={2}>
          {prescriptionMedicines.map((medicine) => (
            <Grid item key={medicine._id} xs={12} sm={6} md={4} lg={3}>
              <Paper elevation={3} className="medicine-item">
                <img
                  className="medicine-image"
                  src={medicine.medicine.image}
                  alt={medicine.medicine.name}
                />
                <Typography variant="h3">{medicine.medicine.name}</Typography>
                <Typography variant="body1">
                  Price: ${medicine.medicine.price}
                </Typography>
                <Typography variant="body1">
                  Description: {medicine.medicine.description}
                </Typography>
                {medicine.medicine.numStock === 0 ? (
                  <div>
                    <Typography variant="body1" style={{ color: "red" }}>
                      Out of stock
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleViewAlternativesClick(medicine.medicine._id)
                      }
                    >
                      View Alternatives
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => addToCart(medicine.medicine._id)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        <div style={{ position: 'fixed', bottom: 0, left: '51.5%', transform: 'translateX(-50%)', marginBottom: '5px' }}>
          <Button
            variant="contained"
            color="primary"
            className="view-cart-button"
            onClick={handleViewCartClick}
          >
            View My Cart
          </Button>
        </div>
      </main>
      {/* Alternatives Modal */}
      <Modal show={showAlternativesModal} onHide={handleCloseAlternativesModal}>
    <Modal.Header closeButton>
      <Modal.Title>Alternatives</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {alternativeTooltip && renderAlternativeTooltip(alternativeTooltip)}
    </Modal.Body>
  </Modal>

      
    </div>
  );
}

export default PrescriptionMedicinesPage;
