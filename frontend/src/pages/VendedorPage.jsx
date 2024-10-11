import React, { useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import TableRow from '../components/TableRow';
import useVendedores from '../hooks/useVendedor'
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../styles/Gerenciamento.css';

const VendedorPage = () => {
  const { vendedor, loading, addVendedor, updateVendedorData, removeVendedor } = useVendedores();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
 
  const navigate = useNavigate();

  const handleAddVendedor = async () => {
    navigate(`/vendedor/create`);
  };

  const handleEditVendedor = async (id_vendedor) => {
    navigate(`/vendedor/update/${id_vendedor}`);

  };

  const handleViewVendedor = async (id_vendedor) => {
    navigate(`/vendedor/view/${id_vendedor}`);
  };

  const handleDeleteVendedor = async (id_vendedor) => {
    await removeVendedor(id_vendedor);
    setAlertMessage("Vendedor deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_vendedor','nome_vendedor', 'tipo', 'percentual_comissao'];

  const actions = {
    view: handleViewVendedor,
    update: handleEditVendedor,
    delete: handleDeleteVendedor
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Vendedores</h2>
          <Button variant="primary" className="custom-button" onClick={handleAddVendedor}>
            Adicionar Vendedor
          </Button>
        </div>

        {alertMessage && (
          <Alert className="alert-success" variant={alertVariant} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : vendedor.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum vendedor encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Percentual de Comissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendedor.map((vendedor) => (
                <TableRow
                 key={vendedor.id_vendedor}
                 rowData={vendedor}
                 columns={columns}
                 actions={actions}
                 idField="id_vendedor"
               />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default VendedorPage;
