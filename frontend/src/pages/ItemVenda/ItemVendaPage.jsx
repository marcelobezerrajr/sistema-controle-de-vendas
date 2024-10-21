import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import useItemVenda from '../../hooks/useItemVenda';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import "../../styles/Gerenciamento.css"

const ItemVendaPage = () => {
  const { itemVenda, loading } = useItemVenda();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const handleAddItemVenda = async () => {
    navigate(`/item-venda/create`);
  };

  const handleViewItemVenda = async (id_item_venda) => {
    navigate(`/item-venda/view/${id_item_venda}`);
  };

  const columns = ['id_item_venda', 'id_venda', 'id_produto', 'quantidade', 'preco_unitario', 'subtotal'];

  const actions = {
    view: handleViewItemVenda
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Item Venda</h2>

          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button variant="primary" className="custom-button" onClick={handleAddItemVenda}>
              Adicionar Item Venda
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
        ) : itemVenda.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhuma item venda encontrada.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Item Venda</th>
                <th>ID Venda</th>
                <th>ID Produto</th>
                <th>Quantidade</th>
                <th>Preço Unitário</th>
                <th>Subtotal</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {itemVenda.map((itemvenda) => (
                <TableRow
                  key={itemvenda.id_item_venda}
                  rowData={itemvenda}
                  columns={columns}
                  actions={actions}
                  idField="id_item_venda"
                />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default ItemVendaPage;
