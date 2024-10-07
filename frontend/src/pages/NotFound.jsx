import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Ops! A página que você procura não existe.</p>
      <button className="custom-button" onClick={() => navigate('/')}>Voltar para página inicial</button>
    </div>
  );
};

export default NotFound;
