import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Typography,
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function PhamaMedicinesList() {
  const [medicines, setMedicines] = useState([]);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [medicalUseFilter, setMedicalUseFilter] = useState("");
  const navigate = useNavigate();
  const [allMedicines, setAllMedicines] = useState([]); // New state for all medicines

  useEffect(() => {
    console.log("Fetching medicines...");
    fetch("http://localhost:4000/api/patients/medicines")
      .then((response) => response.json())
      .then((data) => {
        console.log("Medicines fetched:", data);
        setMedicines(data);
        setAllMedicines(data); // Save all medicines
      })
      .catch((error) => console.error("Error fetching medicines:", error));
  }, []);

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

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

  const handleArchive = async (medicineId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/pharmacists/medicines/archive/${medicineId}`,
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
        toast.success("Medicine archived successfully");
        setMedicines((prevMedicines) =>
          prevMedicines.map((medicine) =>
            medicine._id === medicineId
              ? { ...medicine, isArchived: true }
              : medicine
          )
        );
      } else {
        console.error("Error archiving medicine. Status:", response.status);
      }
    } catch (error) {
      console.error("Error archiving medicine:", error);
    }
  };

  const handleUnarchive = async (medicineId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/pharmacists/medicines/unarchive/${medicineId}`,
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
        toast.success("Medicine unarchived successfully");
        setMedicines((prevMedicines) =>
          prevMedicines.map((medicine) =>
            medicine._id === medicineId
              ? { ...medicine, isArchived: false }
              : medicine
          )
        );
      } else {
        console.error("Error unarchiving medicine. Status:", response.status);
      }
    } catch (error) {
      console.error("Error unarchiving medicine:", error);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontFamily: "cursive" }}
      >
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

        {/* Search Bar on the Left */}
        <div>
          <Container
            style={{
              bottom: 10,
              left: "50%",
              transform: "translateX(-130%)",
              marginBottom: "1px",
              width: "380px",
            }}
          >
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
          <Container
            style={{
              bottom: 10,
              left: "50%",
              transform: "translateY(-102%)",
              marginBottom: "1px",
              width: "380px",
            }}
          >
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
              <Card key={medicine._id} sx={{ maxWidth: 300, margin: 2 }}>
                <CardMedia
                  component="img"
                  alt={medicine.name}
                  height="250"
                  image={medicine.image}
                />
                <CardContent>
                  <Typography variant="h6">{medicine.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ${medicine.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {medicine.description}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "16px",
                  }}
                >
                  {medicine.isArchived ? (
                    <Button
                      onClick={() => handleUnarchive(medicine._id)}
                      variant="contained"
                      color="secondary" // Secondary color
                    >
                      Unarchive
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleArchive(medicine._id)}
                      variant="contained"
                      color="primary" // Primary color
                    >
                      Archive
                    </Button>
                  )}
                </Box>
              </Card>
            ))}
          </div>
        </div>
        <ToastContainer />
      </main>
    </Container>
  );
}

export default PhamaMedicinesList;
