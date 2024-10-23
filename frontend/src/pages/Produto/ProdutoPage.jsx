import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import SearchComponent from '../../components/SearchComponent';
import useProdutos from '../../hooks/useProduto'
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gerenciamento.css';

const ProdutoPage = () => {
  const { produtos, loading, removeProduto } = useProdutos();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [filteredProdutos, setFilteredProdutos] = useState([]);
 
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  useEffect(() => {
    setFilteredProdutos(produtos);
  }, [produtos]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredProdutos(produtos);
    } else {
      const filtered = produtos.filter(produto =>
        produto.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProdutos(filtered);
    }
  };

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
        <div className="header-section d-flex justify-content-between align-items-center">
          <h2>Gerenciamento de Produtos</h2>

          <div className="actions-section d-flex align-items-center">
            <SearchComponent placeholder="Buscar produtos..." onSearch={handleSearch} />

          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button variant="primary" className="custom-button" onClick={handleAddProduto}>
                Adicionar Produto
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
        ) : filteredProdutos.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum produto encontrado.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Produto</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Preço</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProdutos.map((produto) => (
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
