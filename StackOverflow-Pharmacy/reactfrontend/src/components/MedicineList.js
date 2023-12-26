import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-bootstrap";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [userId, setUserId] = useState("");
  const [alternativeTooltip, setAlternativeTooltip] = useState(null);
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);
  const [searchText, setSearchText] = useState(""); // New state for search text
  const navigate = useNavigate();
  const [allMedicines, setAllMedicines] = useState([]); // New state for all medicines
  const [medicalUseFilter, setMedicalUseFilter] = useState("");

  useEffect(() => {
    console.log("Fetching medicines...");
    fetch("http://localhost:4000/api/patients/medicines")
      .then((response) => response.json())
      .then((data) => {
        console.log("Medicines fetched:", data);
        const activeMedicines = data.filter((medicine) => !medicine.isArchived);
        setMedicines(activeMedicines);
        setAllMedicines(activeMedicines); // Save all medicines
      })
      .catch((error) => console.error("Error fetching medicines:", error));
  }, []);

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
  const handleSearch = () => {
    if (searchText.trim() === "" && medicalUseFilter.trim() === "") {
      // If search text and medical use filter are empty, reset to all medicines
      setMedicines(allMedicines);
    } else {
      // Filter medicines based on the search text and medical use filter
      const filteredMedicines = allMedicines.filter(
        (medicine) =>
          medicine.name.toLowerCase().includes(searchText.toLowerCase()) &&
          (medicalUseFilter.trim() === "" ||
            medicine.medicalUse
              .toLowerCase()
              .includes(medicalUseFilter.toLowerCase()))
      );
      setMedicines(filteredMedicines);
    }
  };

  const handleViewCartClick = async () => {
    const fetchedUserId = await getUserId();
    console.log("fetchedUserId:", fetchedUserId);

    if (fetchedUserId) {
      setUserId(fetchedUserId);
      navigate(`/viewCart/${fetchedUserId}`);
    } else {
      // Handle the case where user ID could not be fetched
    }
  };
  const handleViewPrescriptionMedicinesClick = async () => {
    const fetchedUserId = await getUserId();
    console.log("fetchedUserId:", fetchedUserId);

    if (fetchedUserId) {
      setUserId(fetchedUserId);
      // Navigate to the new page with the user ID
      navigate(`/prescriptionMedicines/${fetchedUserId}`);
    } else {
      // Handle the case where user ID could not be fetched
    }
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

  const handleLoginClick = () => {
    navigate("/login");
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
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: "cursive" }}>
        Medicines List
      </Typography>
      
      <main>
        {showLoginMessage && (
          <div className="login-message">
            Please log in to add items to the cart.{" "}
            <Button color="primary" onClick={handleLoginClick}>
              Login
            </Button>
          </div>
        )}
  
  <div style={{
            bottom: 10,
            left: "50%",
            transform: "translateX(-3%)",
            marginBottom: "1px",
          }}>
  {/* Search Bar on the Left */}
  <div >
    <Container
    style={{
      bottom: 10,
      left: "50%",
      transform: "translateX(-130%)",
      marginBottom: "1px",
      width: "380px",
    }}>
      <TextField
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search Medicines"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="search" onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Container>
    <Container  style={{
      bottom: 10,
      left: "50%",
      
      transform: "translateY(-102%)",
      marginBottom: "1px",
      width: "380px",
    }}>
      <TextField
        fullWidth
        value={medicalUseFilter}
        onChange={(e) => setMedicalUseFilter(e.target.value)}
        placeholder="Medical Use"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="search" onClick={handleSearch}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Container>
  </div>

  {/* Medicines List in the Center */}
  <div style={{ flexBasis: "60%" }}>
    <div className="medicine-list">
      {medicines.map((medicine) => (
        <div key={medicine._id} className="medicine-item" style={{ marginBottom: "20px" }}>
          <img
            className="medicine-image"
            src={medicine.image}
            alt={medicine.name}
          />
          <div>
            <Typography variant="h5">{medicine.name}</Typography>
            <Typography>Price: ${medicine.price}</Typography>
            <Typography>Description: {medicine.description}</Typography>
            {medicine.numStock === 0 ? (
              <div>
                <Typography style={{ color: "red" }}>
                  Out of stock
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewAlternativesClick(medicine._id)}
                >
                  View Alternatives
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  className="add-to-cart-button"
                  onClick={() => addToCart(medicine._id)}
                >
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Filter Bar on the Right */}
  <div style={{ flexBasis: "20%" }}>
    
  </div>
</div>

  
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "5px",
          }}
        >
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
  
      <div style={{ position: "fixed", top: "110px", right: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          className="view-prescription-medicines-button"
          onClick={handleViewPrescriptionMedicinesClick}
        >
          View Prescription Medicines
        </Button>
      </div>
      <ToastContainer />
    </Container>
  );
  
}

export default MedicineList;
