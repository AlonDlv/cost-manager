import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, 
  MenuItem, Alert, Stack, InputAdornment 
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import CategoryIcon from '@mui/icons-material/Category';
import idb from '../idb-module';

export default function AddCost() {
  const [formData, setFormData] = useState({ sum: '', currency: 'ILS', category: 'Food', description: '' });
  const [feedback, setFeedback] = useState({ show: false, message: '', severity: 'success' });

  const categories = ['Food', 'Health', 'Education', 'Travel', 'Housing', 'Other'];
  const currencies = ['ILS', 'USD', 'EUR', 'GBP'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.sum || !formData.description) {
      setFeedback({ show: true, message: 'Please fill in all fields', severity: 'error' });
      return;
    }

    try {
      await idb.addCost({
        sum: Number(formData.sum),
        currency: formData.currency,
        category: formData.category,
        description: formData.description,
      });
      setFormData({ sum: '', currency: 'ILS', category: 'Food', description: '' });
      setFeedback({ show: true, message: 'Expense saved! 🚀', severity: 'success' });
    } catch (error) {
      setFeedback({ show: true, message: 'Error saving data', severity: 'error' });
    }
    setTimeout(() => setFeedback(prev => ({ ...prev, show: false })), 3000);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <Box sx={{ bgcolor: '#263238', p: 3, color: 'white' }}>
          <Typography variant="h5" fontWeight="700">Add New Cost</Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          {feedback.show && <Alert severity={feedback.severity} sx={{ mb: 3 }}>{feedback.message}</Alert>}
          <Stack spacing={3}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Amount"
                name="sum"
                type="number"
                fullWidth
                value={formData.sum}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><AttachMoneyIcon sx={{ color: '#2e7d32' }} /></InputAdornment>,
                }}
              />
              <TextField select label="Currency" name="currency" value={formData.currency} onChange={handleChange} sx={{ minWidth: 100 }}>
                {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Stack>

            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 2 }}>
                    <CategoryIcon sx={{ color: '#2e7d32' }} />
                  </InputAdornment>
                ),
              }}
            >
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </TextField>

            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={2}
              value={formData.description}
              onChange={handleChange}
              InputProps={{
                startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}><DescriptionIcon sx={{ color: '#2e7d32' }} /></InputAdornment>,
              }}
            />

            <Button type="submit" variant="contained" size="large" sx={{ bgcolor: '#2e7d32', py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#1b5e20' } }}>
              Save Transaction
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}