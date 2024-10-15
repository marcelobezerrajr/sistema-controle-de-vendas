import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../components/TableRow';
import useUsuario from '../hooks/useUsuario';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../styles/Gerenciamento.css';

const UsuarioPage = () => {
  const { usuarios, loading, removeUsuario } = useUsuario();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
 
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const handleAddUsuario = async () => {
    navigate(`/user/create`);
  };

  const handleEditUsuario = async (id_user) => {
    navigate(`/user/update/${id_user}`);

  };

  const handleViewUsuario = async (id_user) => {
    navigate(`/user/view/${id_user}`);
  };

  const handleDeleteUsuario = async (id_user) => {
    await removeUsuario(id_user);
    setAlertMessage("Usuário deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_user', 'username', 'email', 'permission'];

  const actions = {
    view: handleViewUsuario,
    update: handleEditUsuario,
    delete: handleDeleteUsuario
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Usuários</h2>
          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button variant="primary" className="custom-button" onClick={handleAddUsuario}>
                Adicionar Usuário
            </button>
          )}
        </div>

        {alertMessage && (
          <Alert className="alert-success" variant={alertVariant} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : usuarios.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum usuário encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Permissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <TableRow
                 key={user.id_user}
                 rowData={user}
                 columns={columns}
                 actions={actions}
                 idField="id_user"
               />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default UsuarioPage;
