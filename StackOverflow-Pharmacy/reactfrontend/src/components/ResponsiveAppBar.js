import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";

import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout"; // Import Logout icon
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate(); // useNavigate hook

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout logic
  const handleLogout = () => {
    // Add your logout logic here
    // For example, make a fetch request to your logout endpoint
    fetch(`http://localhost:4000/api/users/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle successful logout, e.g., navigate to login page
        console.log("Logout successful");
        navigate("/login"); // Redirect to the login page
      })
      .catch((error) => {
        console.error("Error logging out", error);
      });
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const isLoginPage = location.pathname === "/login";
  const isPatientSignUpPage = location.pathname === "/signup/patient";
  const isPharmacistSignUpPage = location.pathname === "/signup/pharmacist";
  const isWelcomePage = location.pathname === "/";
  const isChooseTypePage = location.pathname === "/choose-signup-type";
  const isForgotPasswordPage = location.pathname === "/forgot-password";
  const isOTPEntryPage = location.pathname === "/verify-otp";
  const isSetNewPasswordPage = location.pathname === "/set-new-password";

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          {" "}
          <Avatar
            alt="Pharmacy Logo"
            src="../images/snake.jpg"
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 750,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
              flexShrink: 0, // Avoid text shrinking
              flexGrow: 1, // Expand to take available space
            }}
          >
            Pharmacy
          </Typography>
          {!isLoginPage &&
            !isPatientSignUpPage &&
            !isWelcomePage &&
            !isPharmacistSignUpPage &&
            !isChooseTypePage &&
            !isForgotPasswordPage &&
            !isOTPEntryPage &&
            !isSetNewPasswordPage && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem component={Link} to="/change-password" onClick={handleClose}>
                    Change Password
                  </MenuItem>
                  {/* Replace the Profile and My account with Logout */}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
