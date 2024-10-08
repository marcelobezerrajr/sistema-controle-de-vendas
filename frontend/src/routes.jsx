import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RequestPasswordPage from './pages/RequestPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import InvalidTokenPage from './pages/InvalidTokenPage';
// import Dashboard from './pages/Dashboard';
import ClientesPage from './pages/ClientesPage';
import NotFoundPage from './pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/request-password" element={<RequestPasswordPage />} />
      <Route exact path="/reset-password" element={<ResetPasswordPage />} />
      <Route exact path="/invalid-token" element={<InvalidTokenPage />} />
      {/* <Route exact path="/dashboard" element={<Dashboard />} /> */}
      <Route exact path="/clientes" element={<ClientesPage />} />
      <Route exact path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
