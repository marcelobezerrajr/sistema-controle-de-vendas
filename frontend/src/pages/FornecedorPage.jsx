import React, { useState } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import TableRow from '../components/TableRow';
import useFornecedores from '../hooks/useFornecedor'
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../styles/Gerenciamento.css';

const FornecedorPage = () => {
  const { fornecedores, loading, addFornecedor, updateFornecedorData, removeFornecedor } = useFornecedores();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
 
  const navigate = useNavigate();

  const handleAddFornecedor = async () => {
    navigate(`/fornecedor/create`);
  };

  const handleEditFornecedor = async (id_fornecedor) => {
    navigate(`/fornecedor/update/${id_fornecedor}`);

  };

  const handleViewFornecedor = async (id_fornecedor) => {
    navigate(`/fornecedor/view/${id_fornecedor}`);
  };

  const handleDeleteFornecedor = async (id_fornecedor) => {
    await removeFornecedor(id_fornecedor);
    setAlertMessage("Fornecedor deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_fornecedor','nome_fornecedor', 'percentual_comissao', 'impostos'];

  const actions = {
    view: handleViewFornecedor,
    update: handleEditFornecedor,
    delete: handleDeleteFornecedor
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Fornecedores</h2>
          <Button variant="primary" className="custom-button" onClick={handleAddFornecedor}>
            Adicionar Fornecedor
          </Button>
        </div>

        {alertMessage && (
          <Alert className="alert-success" variant={alertVariant} onClose={() => setAlertMessage("")}>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : fornecedores.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum fornecedor encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Percentual de Comissão</th>
                <th>Impostos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {fornecedores.map((fornecedor) => (
                <TableRow
                 key={fornecedor.id_fornecedor}
                 rowData={fornecedor}
                 columns={columns}
                 actions={actions}
                 idField="id_fornecedor"
               />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default FornecedorPage;
