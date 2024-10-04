import React from 'react';
import Button from '../components/Button';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Ops! A página que você procura não existe.</p>
      <Button text="Voltar para página inicial" onClick={() => window.location.href = '/'} />
    </div>
  );
};

export default NotFound;
