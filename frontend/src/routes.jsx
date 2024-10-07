import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<Login />} />
      {/* <Route exact path="/dashboard" element={<Dashboard />} /> */}
      <Route exact path="/clientes" element={<Clientes />} />
      <Route exact path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
