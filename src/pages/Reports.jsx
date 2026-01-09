import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, FormControl, 
  InputLabel, Select, MenuItem, Stack, CircularProgress, Alert
} from '@mui/material';
import idb from '../idb-module';

export default function Reports() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currency, setCurrency] = useState('ILS'); // Default currency
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate lists for dropdowns
  const years = [2024, 2025, 2026];
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const currencies = ['ILS', 'USD', 'EUR', 'GBP'];

  useEffect(() => {
    fetchReport();
  }, [year, month, currency]);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    setReportData(null);

    try {
      // 1. Get custom URL from settings (if exists)
      const customUrl = localStorage.getItem('exchangeRateUrl');

      // 2. Call Partner 1's logic
      const result = await idb.getReport(year, month, currency, customUrl);
      setReportData(result);
    } catch (err) {
      console.error(err);
      setError('Failed to load report. Please check your network or DB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Monthly Report</Typography>
      
      {/* Filters Toolbar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
              {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Month</InputLabel>
            <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
              {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Currency</InputLabel>
            <Select value={currency} label="Currency" onChange={(e) => setCurrency(e.target.value)}>
              {currencies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Content Area */}
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {reportData && (
        <>
           {/* Summary Box */}
           <Paper sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd' }}>
             <Typography variant="h6">
               Total: {reportData.total.total.toFixed(2)} {reportData.total.currency}
             </Typography>
           </Paper>

           {/* Data Table */}
           <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Day</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Original Sum</TableCell>
                  <TableCell>Orig. Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.costs.length === 0 ? (
                  <TableRow><TableCell colSpan={5} align="center">No costs found for this month</TableCell></TableRow>
                ) : (
                  reportData.costs.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.Date.day}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="right">{row.sum}</TableCell>
                      <TableCell>{row.currency}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}