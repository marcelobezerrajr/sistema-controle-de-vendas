import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import useVendaVendedor from '../../hooks/useVendaVendedor';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import "../../styles/Gerenciamento.css";

const VendaVendedorPage = () => {
  const { vendaVendedor, loading } = useVendaVendedor();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const handleAddVendaVendedor = async () => {
    navigate(`/venda-vendedor/create`);
  };

  const handleViewVendaVendedor = async (id_venda, id_vendedor) => {
    navigate(`/venda-vendedor/view/${id_venda}/${id_vendedor}`);
  };

  const columns = ['id_venda', 'id_vendedor', 'tipo_participacao', 'percentual_comissao'];

  const actions = {
    view: handleViewVendaVendedor
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section d-flex justify-content-between align-items-center">
          <h2>Gerenciamento de Venda Vendedor</h2>

          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button variant="primary" className="custom-button ml-2" onClick={handleAddVendaVendedor}>
              Adicionar Venda Vendedor
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
        ) : vendaVendedor.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhuma venda vendedor encontrada.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Venda</th>
                <th>ID Vendedor</th>
                <th>Tipo de Participação</th>
                <th>Percentual de Comissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendaVendedor.map((vendasvendedores) => {
                const { id_venda, id_vendedor } = vendasvendedores;
                const uniqueKey = `${id_venda}-${id_vendedor}`;
                return (
                  <TableRow
                    key={uniqueKey}
                    rowData={vendasvendedores}
                    columns={columns}
                    actions={actions}
                    idField={uniqueKey}
                  />
                );
              })}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default VendaVendedorPage;
