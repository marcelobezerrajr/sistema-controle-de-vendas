import React, { useState } from 'react';
import useProduto from '../hooks/useProduto';
import '../styles/produto.css';

const Produtos = () => {
  const { produtos, loading, addProduto } = useProduto();
  const [newProduto, setNewProduto] = useState('');

  const handleAddProduto = () => {
    if (newProduto.trim() === '') return;
    addProduto({ nome: newProduto });
    setNewProduto('');
  };

  if (loading) return <div className="loader">Carregando...</div>;

  return (
    <div className="produtos-container">
      <h1 className="fade-in">Produtos</h1>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Novo Produto" 
          value={newProduto}
          onChange={(e) => setNewProduto(e.target.value)}
        />
        <button onClick={handleAddProduto}>Adicionar Produto</button>
      </div>
      <ul className="fade-in">
        {produtos.map((produto) => (
          <li key={produto.id} className="produto-item">
            {produto.nome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Produtos;
