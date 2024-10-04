// src/layouts/MainLayout.jsx
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/layout.css'; // Importa o CSS do layout

const MainLayout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <div className="layout-body">
        <Sidebar />
        <main className="content">
          {children} {/* Aqui vai o conteúdo das páginas */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
