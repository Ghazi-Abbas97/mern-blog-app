// src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = isAuthenticated
    ? [
      { label: 'Dashboard', path: '/' },
      { label: 'Add Post', path: '/post/new' },
      { label: 'Logout', action: handleLogout },
    ]
    : [
      { label: 'Login', path: '/login' },
      { label: 'Signup', path: '/signup' },
    ];

  const drawer = (
    <Box sx={{ width: 250 }} onClick={() => setMobileOpen(false)}>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={item.action ? item.action : () => navigate(item.path)}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'white', fontWeight: 'bold' }}
          >
            MERN Blog
          </Typography>

          {/* Desktop buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menuItems.map((item, index) =>
              item.action ? (
                <Button key={index} color="inherit" onClick={item.action}>
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={index}
                  color="inherit"
                  component={Link}
                  to={item.path}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>

          {/* Mobile menu icon */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default NavBar;
