// src/components/SideBar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const SideBar = () => {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => (isActive ? "active" : "")} // Uso correto do NavLink na versão 6+
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/clientes" 
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Clientes
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/fornecedores" 
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Fornecedores
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/vendas" 
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Vendas
          </NavLink>
        </li>
        {/* Adicione outras rotas aqui */}
      </ul>
    </nav>
  );
};

export default SideBar;
