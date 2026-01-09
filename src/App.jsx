import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import idb from './idb-module';
import AddCost from './pages/AddCost';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Charts from './pages/Charts'; // We will create this file in Step 2

function App() {

  // Initialize Database on Startup
  useEffect(() => {
    idb.openCostsDB("costsdb", 1)
      .then(db => console.log("Database Initialized", db))
      .catch(err => console.error("DB Error", err));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default Page (Add Cost) */}
          <Route index element={<AddCost />} />
          
          {/* Real Pages */}
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="charts" element={<Charts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;