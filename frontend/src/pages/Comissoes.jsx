import React, { useState } from 'react';
import useComissao from '../hooks/useComissao';
import '../styles/comissoes.css';

const Comissoes = () => {
  const { comissoes, loading, addComissao } = useComissao();
  const [newComissao, setNewComissao] = useState({ vendedor: '', valor: 0 });

  const handleAddComissao = () => {
    if (!newComissao.vendedor || !newComissao.valor) return;
    addComissao(newComissao);
    setNewComissao({ vendedor: '', valor: 0 });
  };

  if (loading) return <div className="loader">Carregando...</div>;

  return (
    <div className="comissoes-container">
      <h1 className="fade-in">Comissões</h1>
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Vendedor" 
          value={newComissao.vendedor}
          onChange={(e) => setNewComissao({ ...newComissao, vendedor: e.target.value })}
        />
        <input 
          type="number" 
          placeholder="Valor" 
          value={newComissao.valor}
          onChange={(e) => setNewComissao({ ...newComissao, valor: parseFloat(e.target.value) })}
        />
        <button onClick={handleAddComissao}>Adicionar Comissão</button>
      </div>
      <ul className="fade-in">
        {comissoes.map((comissao) => (
          <li key={comissao.id} className="comissao-item">
            {comissao.vendedor} - R$ {comissao.valor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comissoes;
