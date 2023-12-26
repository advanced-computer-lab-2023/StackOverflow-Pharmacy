import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Grid,
  TextField,
  Container,
  Box,
  IconButton,
} from "@mui/material";
import Cookies from "js-cookie";
import SearchIcon from "@mui/icons-material/Search";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Feedback from "./Feedback";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

function PatientHome() {
  const [searchText, setSearchText] = useState("");
  const [filterText, setFilterText] = useState("");
  const [userData, setUserData] = useState({});
  const [patientData, setPatientData] = useState({});
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,        // Add this property for auto-scrolling
    autoplaySpeed: 3000,   // Set the duration (in milliseconds) between slides
  };

  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    return authToken;
  };

  const authToken = getAuthTokenFromCookie();

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/users/profile",
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
        const user = await response.json();
        console.log("User data:", user);

        setUserData(user);
        setPatientData({ name: user.username });

        const userId = user._id;

        const patientResponse = await fetch(
          `http://localhost:4000/api/patients/basic-info/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        if (patientResponse.status === 200) {
          const patientData = await patientResponse.json();
          console.log("Patient data:", patientData);
          setPatientData(patientData);
        } else {
          console.error(
            "Error fetching patient data:",
            patientResponse.statusText
          );
        }
      } else {
        console.error("Error fetching user data:", response.statusText);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleButtonClick = (action, param) => {
    switch (action) {
      case "viewMedicines":
        navigate("/medicines");
        break;
      case "search":
        // Call handleSearch directly when the search button is clicked
        handleSearch();
        break;
      case "filter":
        handleFilter();
        break;
      case "viewOrders":
        navigate("/orders");
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

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontFamily: "cursive", mt: 4 }}
      >
        Welcome {patientData.name}!
      </Typography>

      {/* React Slick Carousel */}
      <Slider {...settings} sx={{ mt: 2 }}>
        <Box
          sx={{
            textAlign: "center",
            borderRadius: "10px",
            overflow: "hidden",
            "& img": {
              width: "100%",
              borderRadius: "10px",
            },
          }}
        >
          <img src="/images/uuuu.webp" alt="Slide 1" />
        </Box>
        <Box
          sx={{
            textAlign: "center",
            borderRadius: "10px",
            overflow: "hidden",
            "& img": {
              width: "100%",
              borderRadius: "10px",
            },
          }}
        >
          <img src="/images/cccc.webp" alt="Slide 2" />
        </Box>
        <Box
          sx={{
            textAlign: "center",
            borderRadius: "10px",
            overflow: "hidden",
            "& img": {
              width: "100%",
              borderRadius: "10px",
            },
          }}
        >
          <img src="/images/dddd.webp" alt="Slide 3" />
        </Box>
      </Slider>

      {/* Pharmacy Information */}
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ mt: 5 }}
      >
        About Our Pharmacy
      </Typography>
      <Typography paragraph sx={{ mt: 2 }}>
        Welcome to Abdullah Pharmacy, your trusted destination for comprehensive
        pharmaceutical care. Our mission is to provide personalized and
        convenient services to enhance your well-being. At Abdullah Pharmacy, we
        prioritize your health by offering a wide range of pharmaceutical and
        healthcare solutions. Our experienced pharmacists are dedicated to
        ensuring that you receive accurate information, timely medications, and
        expert advice. We understand the importance of accessibility and strive
        to make your pharmacy experience as hassle-free as possible. From
        prescription refills to medication counseling, we are here to meet your
        healthcare needs. Our commitment goes beyond merely dispensing
        medications; we aim to foster a supportive community where your health
        is our priority. Abdullah Pharmacy is equipped with modern technology to
        simplify your interactions, allowing for online prescription refills and
        prescription synchronization. We value your time and prioritize
        convenience, making it easier for you to manage your health. As an
        active member of the community, we engage in health education programs
        and local initiatives. Our goal is to contribute to the overall
        well-being of the community we serve. Thank you for choosing Abdullah
        Pharmacy, where your health matters most.
      </Typography>

      {/* Feedback Section */}
      <Feedback />
      {/* Contact Us Section */}
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ mt: 4 }}
      >
        Contact Us
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}
      >
        {/* WhatsApp */}
        <IconButton
          href="https://wa.me/1234567890" // Replace with your WhatsApp link
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon fontSize="large" color="primary" />
        </IconButton>

        {/* Facebook */}
        <IconButton
          href="https://www.facebook.com/yourpharmacy" // Replace with your Facebook link
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mx: 2 }}
        >
          <FacebookIcon fontSize="large" color="primary" />
        </IconButton>

        {/* Instagram */}
        <IconButton
          href="https://www.instagram.com/yourpharmacy" // Replace with your Instagram link
          target="_blank"
          rel="noopener noreferrer"
        >
          <InstagramIcon fontSize="large" color="primary" />
        </IconButton>
      </Box>
    </Container>
  );
}

export default PatientHome;
