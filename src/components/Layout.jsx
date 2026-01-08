import logo from '../assets/logo.png';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  List, 
  Typography, 
  Divider, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  IconButton 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // The Hamburger Icon
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import SettingsIcon from '@mui/icons-material/Settings';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // State to handle open/close

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const menuItems = [
    { text: 'Add Cost', icon: <AddCircleIcon />, path: '/' },
    { text: 'Detailed Reports', icon: <AssessmentIcon />, path: '/reports' },
    { text: 'Analytics', icon: <PieChartIcon />, path: '/charts' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Toolbar /> 
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
        <CssBaseline />
      {/* Top Bar with Menu Button */}
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box 
        component="img" 
        src={logo} 
        alt="Cost Manager Logo"
        sx={{ 
            height: 'auto',        // Maintain aspect ratio
            maxHeight: 64,         // Allow it to be taller (Toolbar is usually 64px)
            my: 1,                 // Add vertical margin to give it breathing room
            maxWidth: 250,         // Prevent it from being too wide on mobile
            objectFit: 'contain'   
        }} 
    />
        </Toolbar>
      </AppBar>

      {/* The Drawer (Slide-out menu) */}
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}