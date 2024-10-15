import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import useComissao from '../hooks/useComissao';
import TableRow from '../components/TableRow';
import MainLayout from '../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import '../styles/Gerenciamento.css';

const ComissaoPage = () => {
  const { comissoes, loading } = useComissao();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const handleAddComissao = async () => {
    navigate(`/comissao/create`);
    setAlertVariant("success");
  };

  const handleViewComissao = async (id_comissao) => {
    navigate(`/comissao/view/${id_comissao}`);
  };

  const columns = ['id_comissao', 'valor_comissao', 'data_pagamento', 'percentual_comissao', 'id_vendedor', 'id_parcela'];

  const actions = {
    view: handleViewComissao,
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Comissões</h2>

          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button variant="primary" className="custom-button" onClick={handleAddComissao}>
              Adicionar Comissão
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
        ) : comissoes.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhuma comissão encontrada.</Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Comissão</th>
                <th>Valor Comissão</th>
                <th>Data Pagamento</th>
                <th>Percentual Comissão</th>
                <th>ID Vendedor</th>
                <th>ID Parcela</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {comissoes.map((comissao) => (
                <TableRow
                  key={comissao.id_comissao}
                  rowData={comissao}
                  columns={columns}
                  actions={actions}
                  idField="id_comissao"
                />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default ComissaoPage;
