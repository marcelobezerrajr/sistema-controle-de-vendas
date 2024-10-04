import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-title">ViperIt - Sistema de Controle de Vendas</div>
      <div className="header-profile">
        {/* Aqui pode incluir o ícone do usuário e opções de logout */}
        <span className="username">Olá, Usuário!</span>
      </div>
    </header>
  );
};

export default Header;
