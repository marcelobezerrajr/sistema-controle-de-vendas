import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import SearchComponent from '../../components/SearchComponent';
import useCliente from '../../hooks/useCliente';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import "../../styles/Gerenciamento.css";

const ClientePage = () => {
  const { clientes, loading, removeCliente } = useCliente();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [filteredClientes, setFilteredClientes] = useState([]);

  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  useEffect(() => {
    setFilteredClientes(clientes);
  }, [clientes]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(cliente =>
        cliente.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClientes(filtered);
    }
  };

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

  const columns = ['id_cliente', 'nome_cliente', 'cpf_cnpj'];

  const actions = {
    view: handleViewCliente,
    update: handleEditCliente,
    delete: handleDeleteCliente
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section d-flex justify-content-between align-items-center">
          <h2>Gerenciamento de Clientes</h2>

          <div className="actions-section d-flex align-items-center">
            <SearchComponent placeholder="Buscar clientes..." onSearch={handleSearch} />
            
            {(userPermission === 'Admin' || userPermission === 'User') && (
              <button variant="primary" className="custom-button ml-2" onClick={handleAddCliente}>
                Adicionar Cliente
              </button>
            )}

          </div>
        </div>

        {alertMessage && (
          <Alert className="alert-success" variant={alertVariant} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : filteredClientes.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum cliente encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Cliente</th>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredClientes.map((cliente) => (
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
