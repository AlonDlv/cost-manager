import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PieChart from '../charts/PieChart'; // Partner 2's component
import BarChart from '../charts/BarChart'; // Partner 2's component
import idb from '../idb-module'; // <--- Using your specific filename


export default function Charts() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // We reuse the getReport logic to feed data to the charts
    const fetchData = async () => {
      try {
        const result = await idb.getReport(year, month, 'ILS'); // Currency doesn't matter for raw data
        setReportData(result);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };
    fetchData();
  }, [year, month]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Analytics</Typography>
      
      {/* Date Filter */}
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Year</InputLabel>
          <Select value={year} label="Year" onChange={(e) => setYear(e.target.value)}>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2026}>2026</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Month</InputLabel>
          <Select value={month} label="Month" onChange={(e) => setMonth(e.target.value)}>
             {Array.from({length: 12}, (_, i) => i + 1).map(m => (
               <MenuItem key={m} value={m}>{m}</MenuItem>
             ))}
          </Select>
        </FormControl>
      </Paper>

      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Expenses by Category</Typography>
            {reportData ? (
               // Pass the costs array to Partner 2's PieChart
               <PieChart costs={reportData.costs} /> 
            ) : <Typography>Loading...</Typography>}
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6">Monthly Overview</Typography>
            {/* Pass the full report or required props to BarChart */}
            <BarChart year={year} /> 
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}