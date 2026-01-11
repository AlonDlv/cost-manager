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
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Divider 
} from '@mui/material';
import TX from '@mui/material/Typography'; // Noticed a small import mix-up in your original file, cleaned it here
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import ZB from '@mui/icons-material/Settings'; // Fixed import name
import SettingsIcon from '@mui/icons-material/Settings';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
      {/* CHANGE: 
          1. bgcolor: 'white' -> White background
          2. color: 'text.primary' -> Dark text/icons
          3. boxShadow: 1 -> Subtle shadow for depth
      */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 1 }}>
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
                height: 'auto',
                maxHeight: 64, 
                my: 1,
                maxWidth: 250,
                objectFit: 'contain'
            }} 
          />
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>

      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}