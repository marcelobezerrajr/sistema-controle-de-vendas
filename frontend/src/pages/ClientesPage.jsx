import React, { useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import TableRow from '../components/TableRow';
import useCliente from '../hooks/useCliente';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../styles/Clientes.css';

const ClientePage = () => {
  const { clientes, loading, addCliente, updateClienteData, removeCliente } = useCliente();
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
  });
  const [currentCliente, setCurrentCliente] = useState(null);
  const navigate = useNavigate();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setForm({ nome: '', email: '', telefone: '' });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddCliente = async () => {
    await addCliente(form);
    setAlertMessage("Cliente adicionado com sucesso!");
    setAlertVariant("success");
    handleCloseModal();
  };

  const handleEditCliente = async () => {
    await updateClienteData(currentCliente.id_cliente, form);
    setAlertMessage("Cliente atualizado com sucesso!");
    setAlertVariant("success");
    handleCloseModal();
  };

  const handleEditClick = (cliente) => {
    setCurrentCliente(cliente);
    setForm(cliente);
    setEditMode(true);
    handleShowModal();
  };

  const handleViewClick = (id) => {
    navigate(`/cliente/view/${id}`);
  };

  const handleDeleteClick = async (id) => {
    await removeCliente(id);
    setAlertMessage("Cliente deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_cliente','nome_cliente', 'cpf_cnpj'];

  const actions = {
    view: handleViewClick,
    update: handleEditClick,
    delete: handleDeleteClick
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Clientes</h2>
          <Button variant="primary" className="custom-button" onClick={handleShowModal}>
            Adicionar Cliente
          </Button>
        </div>

        {alertMessage && (
          <Alert variant={alertVariant} onClose={() => setAlertMessage("")} dismissible>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : clientes.length === 0 ? (
          <Alert className="alert" variant="warning">Nenhum cliente encontrado.</Alert>
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
               />
              ))}
            </tbody>
          </Table>
        )}

        {/* Modal de Adicionar/Editar Cliente
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Editar Cliente' : 'Adicionar Cliente'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="nome">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleFormChange}
                  placeholder="Nome do Cliente"
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  placeholder="Email do Cliente"
                />
              </Form.Group>

              <Form.Group controlId="telefone">
                <Form.Label>Telefone</Form.Label>
                <Form.Control
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleFormChange}
                  placeholder="Telefone do Cliente"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={editMode ? handleEditCliente : handleAddCliente}>
              {editMode ? 'Salvar Alterações' : 'Adicionar Cliente'}
            </Button>
          </Modal.Footer>
        </Modal> */}
      </div>
    </MainLayout>
  );
};

export default ClientePage;
