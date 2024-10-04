import React from 'react';
import '../styles/notfound.css'

const NotFound = () => {
  return (
    <div className="notfound-container fade-in">
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      <a href="/">Voltar para Home</a>
    </div>
  );
};

export default NotFound;
