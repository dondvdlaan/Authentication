import React, { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from './login/Login';
import { Dashboard } from './Dashboard';
import { Application } from './Application';
import { Registration } from './Registration';
import { CreateAccount } from './CreateAccount';


function App() {
  // Constants and variables
    // HOOKS
    

  return (
  <BrowserRouter>
    <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/application" element={<Application />} />
        <Route path="/createAccount" element={<CreateAccount />} />

        <Route path="/"  element={<Navigate to="/dashboard" />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
