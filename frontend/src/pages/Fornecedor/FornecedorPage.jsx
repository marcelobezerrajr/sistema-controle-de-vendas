import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import SearchComponent from '../../components/SearchComponent';
import useFornecedor from '../../hooks/useFornecedor'
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gerenciamento.css';

const FornecedorPage = () => {
  const { fornecedores, loading, removeFornecedor } = useFornecedor();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [filteredFornecedores, setFilteredFornecedores] = useState([]);
 
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  useEffect(() => {
    setFilteredFornecedores(fornecedores);
  }, [fornecedores]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredFornecedores(fornecedores);
    } else {
      const filtered = fornecedores.filter(fornecedor =>
        fornecedor.nome_fornecedor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFornecedores(filtered);
    }
  };

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
        <div className="header-section d-flex justify-content-between align-items-center">
          <h2>Gerenciamento de Fornecedores</h2>

          <div className="actions-section d-flex align-items-center">
            <SearchComponent placeholder="Buscar fornecedores..." onSearch={handleSearch} />

            {(userPermission === 'Admin' || userPermission === 'User') && (
              <button variant="primary" className="custom-button" onClick={handleAddFornecedor}>
                  Adicionar Fornecedor
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
        ) : filteredFornecedores.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum fornecedor encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Fornecedor</th>
                <th>Nome</th>
                <th>Percentual de Comissão</th>
                <th>Impostos</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredFornecedores.map((fornecedor) => (
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
