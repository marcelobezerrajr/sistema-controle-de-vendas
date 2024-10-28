import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import useParcela from '../../hooks/useParcela'
import MainLayout from '../../layouts/MainLayout';
import FilterComponent from '../../components/FilterComponent';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gerenciamento.css';

const ParcelaPage = () => {
  const { parcelas, loading } = useParcela();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [tipoStatusFilter, setTipoStatusFilter] = useState('');
  const [tipoFormaRecebimentoFilter, setTipoFormaRecebimentoFilter] = useState('');
 
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const filteredParcelas = parcelas.filter((parcela) => {
    const matchesTipoStatus = tipoStatusFilter ? parcela.status === tipoStatusFilter : true;
    const matchesTipoFormaRecebimento = tipoFormaRecebimentoFilter ? parcela.forma_recebimento === tipoFormaRecebimentoFilter : true;
    return matchesTipoStatus && matchesTipoFormaRecebimento;
  });

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

  const tipoStatusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Pago', label: 'Pago' },
    { value: 'Atrasado', label: 'Atrasado' },
  ];

  const tipoFormaRecebimentoOptions = [
    { value: 'Primeira', label: 'Primeira' },
    { value: 'Subsequente', label: 'Subsequente' },
  ];

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Parcela</h2>

          <div className="filters-section">
              <FilterComponent
                filterOptions={tipoStatusOptions}
                filterLabel="Tipo Status"
                onFilterChange={setTipoStatusFilter}
                selectedFilter={tipoStatusFilter}
              />
              <FilterComponent
                filterOptions={tipoFormaRecebimentoOptions}
                filterLabel="Tipo Forma de Recebimento"
                onFilterChange={setTipoFormaRecebimentoFilter}
                selectedFilter={tipoFormaRecebimentoFilter}
              />
            </div>

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
        ) : filteredParcelas.length === 0 ? (
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
              {filteredParcelas.map((parcela) => (
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
