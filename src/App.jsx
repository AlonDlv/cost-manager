import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import idb from './idb-module';
import AddCost from './pages/AddCost';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Charts from './pages/Charts';

function App() {
  // Brand colors derived from your logo
  const theme = useMemo(() => createTheme({
    palette: {
      primary: {
        main: '#2e7d32', // The Green from your logo arrow
        light: '#60ad5e',
        dark: '#005005',
      },
      secondary: {
        main: '#263238', // The Charcoal from "PENNYWISE" text
      },
      background: {
        default: '#f4f7f6', // Light grayish teal background
        paper: '#ffffff',
      },
    },
    shape: {
      borderRadius: 12, // Modern, rounded corners
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, color: '#263238' },
      h5: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, padding: '10px 24px' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { boxShadow: '0px 4px 20px rgba(0,0,0,0.05)' },
        },
      },
    },
  }), []);

  useEffect(() => {
    idb.openCostsDB("costsdb", 1)
      .then(db => console.log("Database Initialized", db))
      .catch(err => console.error("DB Error", err));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AddCost />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="charts" element={<Charts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;