import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function PharmacistHome() {
  const [notifications, setNotifications] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");
  const [userData, setUserData] = useState({});
  const [patientData, setPatientData] = useState({});
  const navigate = useNavigate();

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

  const getUserId = async () => {
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
  };

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
        setUserData(user);
        setPatientData({ name: user.username });
      } else {
        console.error("Error fetching user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const userId = await getUserId();
      const response = await fetch(
        `http://localhost:4000/api/pharmacists/notifications/${userId}`,
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
        const fetchedNotifications = await response.json();
        setNotifications(fetchedNotifications.slice(0, 5));
      } else {
        console.error("Error fetching notifications:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData();
      fetchNotifications();
    };

    fetchData();
  }, []);

  const handleButtonClick = (action, param) => {
    switch (action) {
      case "viewMedicines":
        navigate("/medicines-pharma");
        break;
      case "search":
        handleSearch();
        break;
      case "filter":
        handleFilter();
        break;
      case "viewMedicineStats":
        navigate("/medicine-stats");
        break;
      case "viewOrders":
        navigate("/orders");
        break;
      case "addMedicine":
        navigate("/add-medicine");
        break;
      case "editMedicine":
        navigate("/edit-medicine");
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    const searchName = searchText.trim();

    if (searchName === "") {
      alert("Please enter a search term.");
    } else {
      fetch(
        `http://localhost:4000/api/patients/medicines/search?name=${encodeURIComponent(
          searchName
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          navigate("/search-results", { state: { results: data } });
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  };

  const handleFilter = () => {
    const filterTerm = filterText.trim();

    if (filterTerm === "") {
      alert("Please enter a filter term.");
    } else {
      navigate(`/filtered?medicalUse=${encodeURIComponent(filterTerm)}`);
    }
  };

  const handleViewTotalSales = () => {
    navigate("/tootal-sales");
  };

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontFamily: 'cursive' }}
      >
        Welcome {patientData.name} !
      </Typography>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <Paper elevation={3} className="notifications-container" sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Notifications
            </Typography>
            {notifications.length === 0 ? (
              <Typography>No notifications available.</Typography>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {notifications.slice(0, 5).map((notification) => (
                  <li key={notification._id} style={{ marginBottom: 10 }}>
                    <div>{notification.message}</div>
                    <div style={{ color: 'gray' }}>
                      {new Date(notification.timestamp).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {notifications.length === 5 && (
              <Link
              to="/notifications"
              className="view-all-link"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1em", // Adjust the spacing from the last notification
                color: theme => theme.palette.primary.main, // Customize the color
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline", // Show underline on hover
                },
              }}
            >
              View All notifications
            </Link>
            )}
          </Paper>
        </Grid>
        <Grid item md={6}>
          <Paper elevation={3} className="actions-container">
            <Button
              variant="contained"
              onClick={() => handleButtonClick("addMedicine")}
              fullWidth
              sx={{ mb: 1 }}
            >
              Add Medicine
            </Button>
            <Button
              variant="contained"
              onClick={() => handleButtonClick("editMedicine")}
              fullWidth
              sx={{ mb: 1 }}
            >
              Edit Medicine
            </Button>
            <Button
              variant="contained"
              onClick={() => handleButtonClick("viewMedicines")}
              fullWidth
              sx={{ mb: 1 }}
            >
              View Available Medicines
            </Button>
            <Button
              variant="contained"
              onClick={handleViewTotalSales}
              fullWidth
              sx={{ mb: 1 }}
            >
              View Total Sales Report
            </Button>
            <Button
              variant="contained"
              onClick={() => handleButtonClick("viewMedicineStats")}
              fullWidth
              sx={{ mb: 1 }}
            >
              View Medicine Statistics
            </Button>

            <TextField
              fullWidth
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => handleButtonClick("search")}
              fullWidth
              sx={{ mb: 1 }}
            >
              Search for Medicine
            </Button>

            <TextField
              fullWidth
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter"
              variant="outlined"
              sx={{ mb: 1 }}
            />
            <Button
              variant="contained"
              onClick={() => handleButtonClick("filter")}
              fullWidth
              sx={{ mb: 1 }}
            >
              Filter Medicine
            </Button>

            <Button
              variant="contained"
              component={Link}
              to="/upload-image"
              className="upload-button"
              fullWidth
              sx={{ mb: 1 }}
            >
              Upload Medicine Image
            </Button>
            
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PharmacistHome;
