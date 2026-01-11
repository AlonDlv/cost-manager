import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, FormControl, 
  InputLabel, Select, MenuItem, Stack, CircularProgress, 
  Alert, TextField, InputAdornment 
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PaymentsIcon from '@mui/icons-material/Payments';
import AssessmentIcon from '@mui/icons-material/Assessment';
import idb from '../idb-module';

export default function Reports() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currency, setCurrency] = useState('ILS');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const years = [2024, 2025, 2026];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currencies = ['ILS', 'USD', 'EUR', 'GBP'];

  useEffect(() => {
    fetchReport();
  }, [year, month, currency]);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      const customUrl = localStorage.getItem('exchangeRateUrl');
      const result = await idb.getReport(year, month, currency, customUrl);
      setReportData(result);
    } catch (err) {
      setError('Failed to load report. Please check your network or DB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <AssessmentIcon sx={{ color: '#263238', fontSize: 32 }} />
        <Typography variant="h4" fontWeight="700" color="#263238">Monthly Report</Typography>
      </Stack>
      
      <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <TextField
            select
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ minWidth: 120 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
          >
            {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>

          <TextField
            select
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            {months.map(m => (
              <MenuItem key={m} value={m}>
                {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            sx={{ minWidth: 150 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PaymentsIcon fontSize="small" color="primary" />
                </InputAdornment>
              ),
            }}
          >
            {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>
        </Stack>
      </Paper>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {reportData && !loading && (
        <>
           <Paper sx={{ p: 3, mb: 4, bgcolor: '#2e7d32', color: 'white', borderRadius: 3 }}>
             <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 700 }}>Total Expenses</Typography>
             <Typography variant="h3" fontWeight="800">
               {reportData.total.total.toLocaleString()} {reportData.total.currency}
             </Typography>
           </Paper>

           <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#263238' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Day</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 700 }}>Description</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 700 }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.costs.map((row, index) => (
                  <TableRow key={index} sx={{ bgcolor: index % 2 === 0 ? 'white' : '#f9fbf9' }}>
                    <TableCell>{row.Date.day}</TableCell>
                    <TableCell>
                       <Box sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: '#e8f5e9', color: '#2e7d32', display: 'inline-block', fontWeight: 700, fontSize: '0.7rem' }}>
                         {row.category}
                       </Box>
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{row.sum.toFixed(2)} {row.currency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}