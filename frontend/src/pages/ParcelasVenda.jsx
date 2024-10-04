import React from 'react';
import useParcela from '../hooks/useParcela';
import '../styles/parcelasvenda.css';

const ParcelasVenda = () => {
  const { parcelas, loading } = useParcela();

  if (loading) return <div className="loader">Carregando...</div>;

  return (
    <div className="parcelas-venda-container fade-in">
      <h1>Parcelas de Vendas</h1>
      <table>
        <thead>
          <tr>
            <th>Venda</th>
            <th>Parcela</th>
            <th>Valor</th>
            <th>Vencimento</th>
          </tr>
        </thead>
        <tbody>
          {parcelas.map((parcela) => (
            <tr key={parcela.id}>
              <td>{parcela.vendaId}</td>
              <td>{parcela.numero}</td>
              <td>R$ {parcela.valor}</td>
              <td>{parcela.vencimento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParcelasVenda;
