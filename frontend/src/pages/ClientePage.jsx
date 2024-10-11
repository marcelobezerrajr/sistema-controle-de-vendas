import React, { useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import TableRow from '../components/TableRow';
import useCliente from '../hooks/useCliente';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../styles/Gerenciamento.css';

const ClientePage = () => {
  const { clientes, loading, addCliente, updateClienteData, removeCliente } = useCliente();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
 
  const navigate = useNavigate();

  const handleAddCliente = async () => {
    navigate(`/cliente/create`);
  };

  const handleEditCliente = async (id_cliente) => {
    navigate(`/cliente/update/${id_cliente}`);

  };

  const handleViewCliente = async (id_cliente) => {
    navigate(`/cliente/view/${id_cliente}`);
  };

  const handleDeleteCliente = async (id_cliente) => {
    await removeCliente(id_cliente);
    setAlertMessage("Cliente deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_cliente','nome_cliente', 'cpf_cnpj'];

  const actions = {
    view: handleViewCliente,
    update: handleEditCliente,
    delete: handleDeleteCliente
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Clientes</h2>
          <Button variant="primary" className="custom-button" onClick={handleAddCliente}>
            Adicionar Cliente
          </Button>
        </div>

        {alertMessage && (
          <Alert className="alert-success" variant={alertVariant} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : clientes.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum cliente encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <TableRow
                 key={cliente.id_cliente}
                 rowData={cliente}
                 columns={columns}
                 actions={actions}
                 idField="id_cliente"
               />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default ClientePage;
