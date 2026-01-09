import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert } from '@mui/material';

export default function Settings() {
  const [url, setUrl] = useState('');
  const [saved, setSaved] = useState(false);

  // Load existing URL on startup
  useEffect(() => {
    const savedUrl = localStorage.getItem('exchangeRateUrl');
    if (savedUrl) setUrl(savedUrl);
  }, []);

  const handleSave = () => {
    // 1. Save to LocalStorage
    localStorage.setItem('exchangeRateUrl', url);
    
    // 2. Show feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>Settings</Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Define the URL for retrieving currency exchange rates.
        </Typography>

        {saved && <Alert severity="success" sx={{ mb: 2 }}>Settings Saved!</Alert>}

        <TextField
          label="Exchange Rate API URL"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.exchangerate-api.com/..."
          helperText="Leave empty to use the default GitHub fallback."
          sx={{ mb: 3 }}
        />

        <Button variant="contained" onClick={handleSave}>
          Save Configuration
        </Button>
      </Paper>
    </Box>
  );
}