import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from './Login';
import { Dashboard } from './Dashboard';
import { Application } from './Application';


function App() {
  // Constants and variables
    // HOOKS
    const [token, setToken] = useState();

    // Waiting for login token
    if(!token) return <Login setToken={setToken} />;

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/application" element={<Application />} />

      <Route path="/"  element={<Navigate to="/dashboard" />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
