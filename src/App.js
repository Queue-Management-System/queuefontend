import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Components/auth/Login';
import Register from './Components/auth/Register';
import Home from './Components/Home';
import PatientInformation from './pages/patientInformation/PatientInformation';
import Monitoring from "./pages/monitoring/Monitoring";
import Triage from './pages/Triage/Triage';
import Clinic from './pages/clinic/Clinic';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patientInformation" element={<PatientInformation />} />
        <Route path="/Monitoring" element={<Monitoring />} />
        <Route path="/triage/:id" element={<Triage />} />
        <Route path="/clinic" element={<Clinic />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;