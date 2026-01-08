import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AddCost from './pages/AddCost';
import { Typography, Paper } from '@mui/material';

// --- Placeholder Components ---
const Reports = () => <Paper sx={{p:3}}><Typography variant="h4">Monthly Reports</Typography></Paper>;
const Charts = () => <Paper sx={{p:3}}><Typography variant="h4">Visual Analytics</Typography></Paper>;
const Settings = () => <Paper sx={{p:3}}><Typography variant="h4">Settings</Typography></Paper>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<AddCost />} />
          <Route path="reports" element={<Reports />} />
          <Route path="charts" element={<Charts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;