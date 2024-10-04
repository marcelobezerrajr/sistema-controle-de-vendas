import React, { useState } from 'react';
import useCliente from '../hooks/useCliente';
import '../styles/clientes.css';

const Clientes = () => {
  const { clientes, loading, addCliente } = useCliente();
  const [newCliente, setNewCliente] = useState('');

  const handleAddCliente = () => {
    if (newCliente.trim() === '') return;
    addCliente({ nome: newCliente });
    setNewCliente('');
  };

  if (loading) return <div className="loader">Carregando...</div>;

  return (
    <div className="clientes-container">
      <h1 className="fade-in">Clientes</h1>
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Novo Cliente" 
          value={newCliente}
          onChange={(e) => setNewCliente(e.target.value)}
        />
        <button onClick={handleAddCliente}>Adicionar Cliente</button>
      </div>
      <ul className="fade-in">
        {clientes.map((cliente) => (
          <li key={cliente.id} className="cliente-item">
            {cliente.nome}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clientes;
