import React, { useState } from 'react';
import useVendedor from '../hooks/useVendedor';
import '../styles/vendedores.css';

const Vendedores = () => {
  const { vendedores, loading, addVendedor } = useVendedor();
  const [newVendedor, setNewVendedor] = useState('');

  const handleAddVendedor = () => {
    if (newVendedor.trim() === '') return;
    addVendedor({ nome: newVendedor });
    setNewVendedor('');
  };

  if (loading) return <div className="loader">Carregando...</div>;

  return (
    <div className="vendedores-container">
      <h1 className="fade-in">Vendedores</h1>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Novo Vendedor" 
          value={newVendedor}
          onChange={(e) => setNewVendedor(e.target.value)}
        />
        <button onClick={handleAddVendedor}>Adicionar Vendedor</button>
      </div>
      <ul className="fade-in">
        {vendedores.map((vendedor) => (
          <li key={vendedor.id} className="vendedor-item">
            {vendedor.nome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vendedores;
