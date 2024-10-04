import React, { useState } from 'react';
import useFornecedor from '../hooks/useFornecedor';
import '../styles/fornecedores.css';

const Fornecedores = () => {
  const { fornecedores, loading, addFornecedor } = useFornecedor();
  const [newFornecedor, setNewFornecedor] = useState('');

  const handleAddFornecedor = () => {
    if (newFornecedor.trim() === '') return;
    addFornecedor({ nome: newFornecedor });
    setNewFornecedor('');
  };

  if (loading) return <div className="loader">Carregando...</div>;

  return (
    <div className="fornecedores-container">
      <h1 className="fade-in">Fornecedores</h1>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Novo Fornecedor" 
          value={newFornecedor}
          onChange={(e) => setNewFornecedor(e.target.value)}
        />
        <button onClick={handleAddFornecedor}>Adicionar Fornecedor</button>
      </div>
      <ul className="fade-in">
        {fornecedores.map((fornecedor) => (
          <li key={fornecedor.id} className="fornecedor-item">
            {fornecedor.nome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Fornecedores;
