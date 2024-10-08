import React, { useState } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import MainLayout from '../layouts/MainLayout';
import useCliente from '../hooks/useCliente';
import '../styles/Clientes.css';

const ClientesPage = () => {
  const { clientes, loading, addCliente, updateClienteData, removeCliente } = useCliente();
  const [showModal, setShowModal] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (selectedCliente) {
      await updateClienteData(selectedCliente.id_cliente, formData);
    } else {
      await addCliente(formData);
    }
    setShowModal(false);
    setFormData({ name: '', email: '' });
    setSelectedCliente(null);
  };

  const handleDelete = async (id) => {
    await removeCliente(id);
  };

  const handleOpenModal = (cliente = null) => {
    if (cliente) {
      setSelectedCliente(cliente);
      setFormData({ name: cliente.nome, email: cliente.email });
    }
    setShowModal(true);
  };

  return (
    <MainLayout>
      <div className="clientes-container">
        <h1>Gerenciamento de Clientes</h1>
        <Button variant="primary" onClick={() => handleOpenModal()}>Adicionar Cliente</Button>

        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover className="clientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length > 0 ? (
                clientes.map(cliente => (
                  <tr key={cliente.id_cliente}>
                    <td>{cliente.id_cliente}</td>
                    <td>{cliente.nome}</td>
                    <td>{cliente.email}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleOpenModal(cliente)}>Editar</Button>
                      <Button variant="danger" onClick={() => handleDelete(cliente.id_cliente)}>Excluir</Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">Nenhum cliente encontrado.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCliente ? 'Editar Cliente' : 'Adicionar Cliente'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formEmail" className="mt-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleSubmit}>{selectedCliente ? 'Salvar Alterações' : 'Adicionar'}</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </MainLayout>
  );
};

export default ClientesPage;
