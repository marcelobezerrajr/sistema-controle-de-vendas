import React from 'react';
import useVenda from '../hooks/useVenda';
import { useParams } from 'react-router-dom';
import '../styles/detalhevenda.css';

const DetalheVenda = () => {
  const { id } = useParams();
  const { venda, loading } = useVenda(id);

  if (loading) return <div className="loader">Carregando...</div>;

  return (
    <div className="detalhe-venda-container fade-in">
      <h1>Detalhes da Venda #{venda.id}</h1>
      <p>Cliente: {venda.cliente}</p>
      <p>Total: R$ {venda.total}</p>
      <h2>Itens</h2>
      <ul>
        {venda.itens.map((item) => (
          <li key={item.id}>
            {item.nome} - {item.quantidade}x - R$ {item.preco}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DetalheVenda;
