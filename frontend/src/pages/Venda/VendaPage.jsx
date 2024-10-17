import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import useVendas from '../../hooks/useVenda'
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gerenciamento.css';

const VendaPage = () => {
  const { vendas, loading, removeVenda } = useVendas();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
 
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const handleAddVenda = async () => {
    navigate(`/venda/create`);
  };

  const handleEditVenda = async (id_venda) => {
    navigate(`/venda/update/${id_venda}`);

  };

  const handleViewVenda = async (id_venda) => {
    navigate(`/venda/view/${id_venda}`);
  };

  const handleDeleteVenda = async (id_venda) => {
    await removeVenda(id_venda);
    setAlertMessage("venda deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_venda','tipo_venda', 'tipo_faturamento', 'valor_total', 'moeda', 'valor_convertido', 'id_cliente', 'id_fornecedor'];

  const actions = {
    view: handleViewVenda,
    update: handleEditVenda,
    delete: handleDeleteVenda
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Vendas</h2>
          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button variant="primary" className="custom-button" onClick={handleAddVenda}>
                Adicionar Venda
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
        ) : vendas.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhum venda encontrada.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Venda</th>
                <th>Tipo Venda</th>
                <th>Tipo Faturamento</th>
                <th>Valor Total</th>
                <th>Moeda</th>
                <th>Valor Convertido</th>
                <th>ID Cliente</th>
                <th>ID Fornecedor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda) => (
                <TableRow
                 key={venda.id_venda}
                 rowData={venda}
                 columns={columns}
                 actions={actions}
                 idField="id_venda"
               />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default VendaPage;
