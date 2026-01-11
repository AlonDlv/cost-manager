import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, MenuItem, 
  Stack, TextField, InputAdornment, CircularProgress 
} from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChart from '../charts/PieChart'; // Partner 2's component
import BarChart from '../charts/BarChart'; // Partner 2's component
import idb from '../idb-module'; 

export default function Charts() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetching ILS data as a base for visualization
        const result = await idb.getReport(year, month, 'ILS'); 
        setReportData(result);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [year, month]);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header with Brand Icon */}
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <DonutLargeIcon sx={{ color: '#263238', fontSize: 32 }} />
        <Typography variant="h4" fontWeight="700" color="#263238">
          Financial Analytics
        </Typography>
      </Stack>
      
      {/* Modern Filter Toolbar */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0', borderRadius: 3 }}>
        <Stack direction="row" spacing={3}>
          <TextField
            select
            label="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            sx={{ minWidth: 140 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon fontSize="small" sx={{ color: '#2e7d32' }} />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
            <MenuItem value={2026}>2026</MenuItem>
          </TextField>

          <TextField
            select
            label="Month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            sx={{ minWidth: 160 }}
          >
             {Array.from({length: 12}, (_, i) => i + 1).map(m => (
               <MenuItem key={m} value={m}>
                 {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
               </MenuItem>
             ))}
          </TextField>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress sx={{ color: '#2e7d32' }} />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Pie Chart Card */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 0, 
                height: 480, 
                overflow: 'hidden', 
                border: '1px solid #e0e0e0', 
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ bgcolor: '#263238', p: 2, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <DonutLargeIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight="700">Expenses by Category</Typography>
              </Box>
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {reportData?.costs?.length > 0 ? (
                   <PieChart costs={reportData.costs} /> 
                ) : (
                  <Typography color="text.secondary">No data for this period</Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Bar Chart Card */}
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 0, 
                height: 480, 
                overflow: 'hidden', 
                border: '1px solid #e0e0e0', 
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ bgcolor: '#263238', p: 2, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChartIcon fontSize="small" />
                <Typography variant="subtitle1" fontWeight="700">Annual Trend</Typography>
              </Box>
              <Box sx={{ p: 3, flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <BarChart year={year} /> 
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}