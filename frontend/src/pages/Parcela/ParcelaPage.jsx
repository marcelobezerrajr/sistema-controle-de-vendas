import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import useParcelas from '../../hooks/useParcela'
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gerenciamento.css';

const ParcelaPage = () => {
  const { parcelas, loading } = useParcelas();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
 
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const handleAddParcela = async () => {
    navigate(`/parcela/create`);
  };

  const handleEditParcela = async (id_parcela) => {
    navigate(`/parcela/update/${id_parcela}`);

  };

  const handleViewParcela = async (id_parcela) => {
    navigate(`/parcela/view/${id_parcela}`);
  };


  const columns = ['id_parcela', 'id_venda', 'numero_parcela', 'valor_parcela', 'data_prevista', 'data_recebimento', 'status', 'forma_recebimento'];

  const actions = {
    view: handleViewParcela,
    update: handleEditParcela,
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Parcela</h2>
          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button variant="primary" className="custom-button" onClick={handleAddParcela}>
                Adicionar Parcela
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
        ) : parcelas.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhuma parcela encontrada.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Parcela</th>
                <th>ID Venda</th>
                <th>Número da Parcela</th>
                <th>Valor da Parcela</th>
                <th>Data Prevista</th>
                <th>Data Recebimento</th>
                <th>Status</th>
                <th>Forma Recebimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {parcelas.map((parcela) => (
                <TableRow
                 key={parcela.id_parcela}
                 rowData={parcela}
                 columns={columns}
                 actions={actions}
                 idField="id_parcela"
               />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default ParcelaPage;
