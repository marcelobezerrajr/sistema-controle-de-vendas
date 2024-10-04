import React, { useState } from 'react';
import '../styles/perfil.css';

const Perfil = () => {
  const [user, setUser] = useState({ nome: 'João', email: 'joao@viperit.com' });
  const [editMode, setEditMode] = useState(false);

  const handleSave = () => {
    setEditMode(false);
    // Função para salvar as alterações
  };

  return (
    <div className="perfil-container fade-in">
      <h1>Perfil do Usuário</h1>
      <div className="perfil-info">
        <label>Nome:</label>
        {editMode ? (
          <input
            type="text"
            value={user.nome}
            onChange={(e) => setUser({ ...user, nome: e.target.value })}
          />
        ) : (
          <p>{user.nome}</p>
        )}
        <label>Email:</label>
        {editMode ? (
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        ) : (
          <p>{user.email}</p>
        )}
        <button onClick={() => (editMode ? handleSave() : setEditMode(true))}>
          {editMode ? 'Salvar' : 'Editar'}
        </button>
      </div>
    </div>
  );
};

export default Perfil;
