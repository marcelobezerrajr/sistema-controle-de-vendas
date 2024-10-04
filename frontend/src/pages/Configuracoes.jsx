import React from 'react';
import '../styles/configuracoes.css';

const Configuracoes = () => {
  return (
    <div className="configuracoes-container fade-in">
      <h1>Configurações Gerais</h1>
      <div className="config-options">
        <button>Alterar Senha</button>
        <button>Configurações de Notificações</button>
        <button>Preferências de Tema</button>
      </div>
    </div>
  );
};

export default Configuracoes;
