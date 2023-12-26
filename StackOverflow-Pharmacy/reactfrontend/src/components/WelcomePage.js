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
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Feedback from "./Feedback";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import '../styles/WelcomePage.css'; // Import your CSS file

function WelcomePage() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,        // Add this property for auto-scrolling
    autoplaySpeed: 3000,   // Set the duration (in milliseconds) between slides
  };

  return (
    <div
      className="welcome-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundImage: 'url("../images/backg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Content */}
      <Container
        className="content"
        maxWidth="sm"
        style={{
          backgroundColor: 'rgba(245, 245, 245, 0.9)', // Background color with opacity
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
          textAlign: 'center',
          transform: 'translateY(-150px)', // Adjust the translation as needed
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'cursive', color: 'black' }}>
          Welcome to Our Pharmacy
        </Typography>
        <div className="buttons">
          <Link to="/choose-signup-type" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ marginRight: '16px' }}
            >
              Sign Up
            </Button>
          </Link>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="outlined" color="primary" size="large">
              Log In
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

export default WelcomePage;
