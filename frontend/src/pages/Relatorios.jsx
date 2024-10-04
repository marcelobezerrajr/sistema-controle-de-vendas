import React from 'react';
import '../styles/relatorios.css';

const Relatorios = () => {
  return (
    <div className="relatorios-container fade-in">
      <h1>Relatórios</h1>
      <div className="reports-options">
        <button>Vendas por Período</button>
        <button>Produtos mais Vendidos</button>
        <button>Comissões por Vendedor</button>
      </div>
      <div className="report-view">
        <h2>Selecione um relatório para visualizar</h2>
      </div>
    </div>
  );
};

export default Relatorios;
