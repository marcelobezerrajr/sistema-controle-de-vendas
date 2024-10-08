import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Ops! A página que você procura não existe.</p>
      <Button className="custom-button" onClick={handleGoHome}>Voltar para página inicial</Button>
    </div>
  );
};

export default NotFoundPage;
