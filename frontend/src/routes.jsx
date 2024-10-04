import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Vendas from './pages/Venda';
import Produtos from './pages/Produtos';
import Fornecedores from './pages/Fornecedores';
import Vendedores from './pages/Vendedores';
import Comissoes from './pages/Comissoes';
import DetalheVenda from './pages/DetalheVenda';
import ParcelasVenda from './pages/ParcelasVenda';
import Relatorios from './pages/Relatorios';
import Perfil from './pages/Perfil';
import Configuracoes from './pages/Configuracoes';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    // <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/fornecedores" element={<Fornecedores />} />
        <Route path="/vendedores" element={<Vendedores />} />
        <Route path="/comissoes" element={<Comissoes />} />
        <Route path="/detalhevenda" element={<DetalheVenda />} />
        <Route path="/parcelasvenda" element={<ParcelasVenda />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    // </MainLayout>
  );
};

export default AppRoutes;
