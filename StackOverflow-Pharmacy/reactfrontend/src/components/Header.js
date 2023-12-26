import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ResponsiveAppBar from './ResponsiveAppBar';
import { styled, useTheme } from '@mui/system';

const HeaderContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderBottom: `2px solid ${theme.palette.secondary.main}`,
}));

const LogoContainer = styled('div')({
  flexGrow: 1,
  '& .navLink': {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
});

const LogoutBtnContainer = styled('div')({
  '& button': {
    color: 'white',
    fontSize: '1rem',
  },
});

const ResponsiveMenuButton = styled(IconButton)(({ theme }) => ({  // <-- Add theme here
  marginRight: '16px',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const Header = () => {
  const theme = useTheme();

  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const logout = () => {
    fetch(`http://localhost:4000/api/users/logout/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        navigate('/login');
      })
      .catch((error) => console.error('Error logging out', error));
  };

  return (
    <HeaderContainer position="static">
      <Toolbar>
        <ResponsiveMenuButton onClick={toggleDrawer} edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </ResponsiveMenuButton>
        <LogoContainer>
          <Link to="/" className="navLink">
            <Typography variant="h6">Pharmacy</Typography>
          </Link>
        </LogoContainer>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem>
              <Button component={Link} to="/your-route" color="inherit" onClick={toggleDrawer}>
                Your Route
              </Button>
            </ListItem>
            {/* Add more items as needed */}
          </List>
        </Drawer>
        <ResponsiveAppBar /> {/* Render the ResponsiveAppBar component */}
        <LogoutBtnContainer>
          <Button onClick={() => logout()} color="inherit">
            Logout
          </Button>
        </LogoutBtnContainer>
      </Toolbar>
    </HeaderContainer>
  );
};

export default Header;
