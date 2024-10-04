import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <img src="/logo.png" alt="ViperIT Logo" className="header-logo" />
      <nav>
        <Link to="/">Home</Link>
        <Link to="/clientes">Clientes</Link>
        <Link to="/vendas">Vendas</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/fornecedores">Fornecedores</Link>
      </nav>
    </header>
  );
};

export default Header;
