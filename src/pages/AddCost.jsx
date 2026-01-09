import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel, 
  Alert,
  Stack 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function AddCost() {
  const [formData, setFormData] = useState({
    sum: '',
    currency: 'ILS', // Default to ILS
    category: 'Food', // Default category
    description: ''
  });

  const [feedback, setFeedback] = useState({ show: false, message: '', severity: 'success' });

  // Categories list (Expand as needed)
  const categories = ['Food', 'Health', 'Education', 'Travel', 'Housing', 'Other'];
  
  // Project Requirements: Supported Currencies
  const currencies = ['ILS', 'USD', 'EUR', 'GBP'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Basic Validation
    if (!formData.sum || !formData.description) {
      setFeedback({ show: true, message: 'Please fill in all fields', severity: 'error' });
      return;
    }

    // 2. Prepare the object (Exactly what Partner 1's idb.js will need)
    const newCost = {
      sum: Number(formData.sum),
      currency: formData.currency,
      category: formData.category,
      description: formData.description,
      // Date is added automatically by the backend/idb, but you can verify that with Partner 1.
    };

    console.log("Submitting to IDB:", newCost); 

    const handleSubmit = async (e) => { // Make function async
    e.preventDefault();

    if (!formData.sum || !formData.description) {
      setFeedback({ show: true, message: 'Please fill in all fields', severity: 'error' });
      return;
    }

    const newCost = {
      sum: Number(formData.sum),
      currency: formData.currency,
      category: formData.category,
      description: formData.description,
    };

    try {
      // CHANGE: Call idb.addCost
      await idb.addCost(newCost); 
      
      setFormData({ sum: '', currency: 'ILS', category: 'Food', description: '' });
      setFeedback({ show: true, message: 'Item added successfully! 🚀', severity: 'success' });
    } catch (error) {
      console.error(error);
      setFeedback({ show: true, message: 'Error adding item', severity: 'error' });
    }
    
    setTimeout(() => setFeedback(prev => ({ ...prev, show: false })), 3000);
  };
    
    // 3. Reset Form & Show Success
    setFormData({ sum: '', currency: 'ILS', category: 'Food', description: '' });
    setFeedback({ show: true, message: 'Item added successfully! 🚀', severity: 'success' });
    
    // Hide notification after 3 seconds
    setTimeout(() => setFeedback({ ...feedback, show: false }), 3000);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Cost Item
        </Typography>

        {feedback.show && (
          <Alert severity={feedback.severity} sx={{ mb: 2 }}>
            {feedback.message}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            
            {/* Row 1: Sum and Currency */}
            <Stack direction="row" spacing={2}>
              <TextField
                label="Sum"
                name="sum"
                type="number"
                value={formData.sum}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: "0", step: "0.01" }}
              />
              
              <FormControl sx={{ minWidth: 100 }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  name="currency"
                  value={formData.currency}
                  label="Currency"
                  onChange={handleChange}
                >
                  {currencies.map(curr => (
                    <MenuItem key={curr} value={curr}>{curr}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {/* Row 2: Category */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                label="Category"
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Row 3: Description */}
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={2}
            />

            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              endIcon={<SendIcon />}
            >
              Add Item
            </Button>

          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}