import React, { useState } from 'react';
import useVenda from '../hooks/useVenda';
import '../styles/venda.css';

const Vendas = () => {
  const { vendas, loading, addVenda } = useVenda();
  const [novaVenda, setNovaVenda] = useState({ produto: '', quantidade: 0 });

  const handleAddVenda = () => {
    if (!novaVenda.produto || !novaVenda.quantidade) return;
    addVenda(novaVenda);
    setNovaVenda({ produto: '', quantidade: 0 });
  };

  if (loading) return <div className="loader">Carregando...</div>;

  return (
    <div className="vendas-container">
      <h1 className="fade-in">Vendas</h1>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Produto" 
          value={novaVenda.produto}
          onChange={(e) => setNovaVenda({ ...novaVenda, produto: e.target.value })}
        />
        <input 
          type="number" 
          placeholder="Quantidade" 
          value={novaVenda.quantidade}
          onChange={(e) => setNovaVenda({ ...novaVenda, quantidade: parseInt(e.target.value) })}
        />
        <button onClick={handleAddVenda}>Adicionar Venda</button>
      </div>
      <table className="fade-in">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((venda) => (
            <tr key={venda.id}>
              <td>{venda.produto}</td>
              <td>{venda.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Vendas;
