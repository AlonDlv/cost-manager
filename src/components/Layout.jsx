import logo from '../assets/logo.png';
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Drawer, AppBar, Toolbar, List, ListItem, 
  ListItemButton, ListItemIcon, ListItemText, IconButton, Typography 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { text: 'Add Cost', icon: <AddCircleOutlineIcon />, path: '/' },
    { text: 'Reports', icon: <AssessmentOutlinedIcon />, path: '/reports' },
    { text: 'Analytics', icon: <DonutLargeIcon />, path: '/charts' },
    { text: 'Settings', icon: <SettingsOutlinedIcon />, path: '/settings' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'white', borderBottom: '1px solid #eee' }} elevation={0}>
        <Toolbar>
          <IconButton color="secondary" onClick={() => setOpen(!open)} sx={{ mr: 2 }}><MenuIcon /></IconButton>
          <Box component="img" src={logo} alt="PennyWise" sx={{ height: 40, mr: 1 }} />
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          width: 260,
          '& .MuiDrawer-paper': { width: 260, borderRight: 'none', pt: 8 },
        }}
      >
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  onClick={() => { navigate(item.path); setOpen(false); }}
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: active ? 'primary.light' : 'transparent',
                    color: active ? 'white' : 'text.primary',
                    '&:hover': { bgcolor: active ? 'primary.main' : '#f0f0f0' },
                    '& .MuiListItemIcon-root': { color: active ? 'white' : 'inherit' }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: active ? 700 : 500 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
}