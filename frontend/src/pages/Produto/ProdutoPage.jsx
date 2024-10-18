import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import useProdutos from '../../hooks/useProduto'
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gerenciamento.css';

const ProdutoPage = () => {
  const { produtos, loading, removeProduto } = useProdutos();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
 
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const handleAddProduto = async () => {
    navigate(`/produto/create`);
  };

  const handleEditProduto = async (id_produto) => {
    navigate(`/produto/update/${id_produto}`);

  };

  const handleViewProduto = async (id_produto) => {
    navigate(`/produto/view/${id_produto}`);
  };

  const handleDeleteProduto = async (id_produto) => {
    await removeProduto(id_produto);
    setAlertMessage("produto deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_produto', 'nome_produto', 'descricao_produto', 'preco', 'tipo'];

  const actions = {
    view: handleViewProduto,
    update: handleEditProduto,
    delete: handleDeleteProduto
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Produtos</h2>
          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button variant="primary" className="custom-button" onClick={handleAddProduto}>
                Adicionar Produto
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
        ) : produtos.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum produto encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <TableRow
                 key={produto.id_produto}
                 rowData={produto}
                 columns={columns}
                 actions={actions}
                 idField="id_produto"
               />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default ProdutoPage;
