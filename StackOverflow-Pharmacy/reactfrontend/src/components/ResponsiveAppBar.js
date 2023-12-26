import * as React from "react";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Drawer from "@mui/material/Drawer";
import { useNavigate, Link, useLocation } from "react-router-dom";
import ListItemIcon from "@mui/material/ListItemIcon";
import Cookies from "js-cookie";
import MedicationIcon from "@mui/icons-material/Medication";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { InputAdornment, Grid, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GradingIcon from '@mui/icons-material/Grading';
import HomeIcon from '@mui/icons-material/Home';
import WalletIcon from '@mui/icons-material/Wallet';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import InfoIcon from '@mui/icons-material/Info';
import ChatIcon from '@mui/icons-material/Chat';
function ResponsiveAppBar() {
  const [searchText, setSearchText] = useState("");
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true); // New loading state
  const getAuthTokenFromCookie = () => {
    const authToken = Cookies.get("jwt", { domain: "localhost", path: "/" });
    console.log("Auth token:", authToken);
    return authToken;
  };
  const administratorPages = [
    "admin home",
    "      ",
    "View Requests",
    "Add Admin",
    "View available Medicines",
    "Remove Pharmacist",
    "Remove Patient",
    "View Pharmacist Info",
    "View Patient Info",
    "Sales Report",
    
    
  ];
  const pharmacistPages = [
    "pharmacist home",
    "      ",
    "Add Medicine",
    "Edit Medicine",
    "View Medicines",
    "View Sales Report",
    "Medicine Statistics",
    "Upload Medicine Image",
    "My Wallet",
    "Notifications",
    "Chats",
  ];
  const patientPages = [
    "patient home",
    "      ",
    "Medicines",
    "Orders",
    "Add Prescription",
    "My Wallet",
    "Chats",
  ];
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
        return user; // Return the user object
      } else {
        console.error("Error fetching user profile:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const [menuPages, setMenuPages] = React.useState([]);

  const getMenuPages = (role) => {
    switch (role) {
      case "Administrator":
        return administratorPages;
      case "Pharmacist":
        return pharmacistPages;
      case "Patient":
        return patientPages;
      default:
        return [];
    }
  };

  React.useEffect(() => {
    console.log("useEffect triggered");
    fetchUserRole();
  }, [location.key]);

  const fetchUserRole = async () => {
    console.log("Fetching user role...");
    setIsLoading(true); // Set loading to true while fetching
    const user = await getUserId();
    console.log("User role:", user?.role);

    if (user) {
      setUserRole(user.role);
      setMenuPages(getMenuPages(user.role));
    }

    setIsLoading(false); // Set loading to false after fetching
  };
  const handleButtonClick = (action) => {
    // Define the logic for handling the button click
    console.log("Button clicked with action:", action);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

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

  const handleLogout = () => {
    console.log("Logout successful");
    navigate("/login");
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
  const isUploadDocumentsPage = location.pathname === "/upload-Documents";

  const pageMappings = {
    Medicines: {
      displayName: "Available Medicines",
      path: "/medicines",
    },
    Orders: {
      displayName: "My Orders",
      path: "/orders",
    },
    "Add Prescription": {
      // Add mapping for the new page
      displayName: "Add Prescription",
      path: "/add-prescription",
    },
    "patient home":{
      displayName: "Home",
      path: "/patient-home",
    },
    "pharmacist home":{
      displayName: "Home",
      path: "/pharmacist-home",
    },
    "admin home":{
      displayName: "Home",
      path: "/admin-home",
    },
    "My Wallet":{
      displayName: "My Wallet",
      path: "/wallet",
    },
    "Add Medicine":{
      displayName: "Add Medicine",
      path: "/add-medicine",
    },
    "Edit Medicine":{
      displayName: "Edit Medicine",
      path: "/edit-medicine",
    },
    "View Sales Report":{
      displayName: "Sales Report",
      path: "/tootal-sales",
    },
    "View Medicines":{
      displayName: "View Medicines",
      path: "/medicines-pharma",
    },
    "Medicine Statistics":{
      displayName: "Medicine Statistics",
      path: "/medicine-stats",
    },
    "Upload Medicine Image":{
      displayName: "Upload Medicine Image",
      path: "/upload-image",
    },
    "Notifications":{
      displayName: "Notifications",
      path: "/notifications",
    },
    "View Requests":{
      displayName: "View Requests",
      path: "/requests",
    },
    "View available Medicines":{
      displayName: "View available Medicines",
      path: "/medicines-admin",
    },
    "Remove Pharmacist":{
      displayName: "Remove Pharmacist",
      path: "/remove-pharmacist",
    },
    "Remove Patient":{
      displayName: "Remove Patient",
      path: "/remove-patient",
    },
    "View Pharmacist Info":{
      displayName: "View Pharmacist Info",
      path: "/view-pharmacist-info",
    },
    "View Patient Info":{
      displayName: "View Patient Info",
      path: "/view-patient-info",
    },
    "Sales Report":{
      displayName: "Sales Report",
      path: "/total-sales",
    },
    "Chats":{
      displayName: "Chats",
      path: "/MainComponent",
    },

    // Add more pages as needed
  };
  return (
    <AppBar position="static" key={location.key}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            padding: "8px 16px", // Adjusted padding
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt="Pharmacy Logo"
              src="../images/snake.jpg"
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                fontFamily: "monospace",
                fontWeight: 750,
                letterSpacing: ".2rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Pharmacy
            </Typography>
          </Box>
          {!isLoading &&
            !isLoginPage &&
            !isPatientSignUpPage &&
            !isPharmacistSignUpPage &&
            !isWelcomePage &&
            !isChooseTypePage &&
            !isForgotPasswordPage &&
            !isOTPEntryPage &&
            !isSetNewPasswordPage &&
            !isUploadDocumentsPage && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
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
                    <MenuItem
                      component={Link}
                      to="/change-password"
                      onClick={handleClose}
                    >
                      Change Password
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </div>
                <IconButton
                  size="large"
                  aria-label="menu"
                  onClick={handleDrawerOpen}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={isDrawerOpen}
                  onClose={handleDrawerClose}
                  sx={{ width: "300px !important" }}
                >
                  <List>
                    {menuPages.map((page, index) => (
                      <ListItem
                        key={page}
                        button
                        component={Link}
                        to={
                          pageMappings[page]?.path ||
                          `/${page.toLowerCase().replace(/\s+/g, "-")}`
                        }
                        onClick={handleDrawerClose}
                        sx={{
                          color: "primary.main",
                          "&:hover": { backgroundColor: "primary.dark" },
                        }}
                      >
                        {/* You can add icons based on the page or index */}
                        <ListItemIcon>
                          {page === "Medicines" && <MedicationIcon />}
                          {page === "Orders" && <LocalShippingIcon />}
                          {page === "Add Prescription" && <GradingIcon />}
                          {page === "patient home" && <HomeIcon />}
                          {page === "My Wallet" && <WalletIcon />}
                          {page === "Add Medicine" && <AddIcon />}
                          {page === "Edit Medicine" && <EditIcon />}
                          {page === "View Medicines" && <MedicationIcon />}
                          {page === "Sales Report" && <AssessmentIcon />}
                          {page === "Medicine Statistics" && <ShowChartIcon />}
                          {page === "Upload Medicine Image" && <DriveFolderUploadIcon />}
                          {page === "pharmacist home" && <HomeIcon />}
                          {page === "Notifications" && <CircleNotificationsIcon />}
                          {page === "View Requests" && <GroupAddIcon />}
                          {page === "Add Admin" && <AddIcon />}
                          {page === "View available Medicines" && <MedicationIcon />}
                          {page === "Remove Pharmacist" && <PersonRemoveIcon />}
                          {page === "Remove Patient" && <PersonRemoveIcon />}
                          {page === "View Pharmacist Info" && <InfoIcon />}
                          {page === "View Patient Info" && <InfoIcon />}
                          {page === "admin home" && <HomeIcon />}
                          {page === "View Sales Report" && <AssessmentIcon />}
                          {page === "Chats" && <ChatIcon />}

                        </ListItemIcon>
                        <ListItemText
                          primary={pageMappings[page]?.displayName || page}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Drawer>
              </Box>
            )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
