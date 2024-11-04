import React, { useState } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import useVenda from '../../hooks/useVenda';
import MainLayout from '../../layouts/MainLayout';
import FilterComponent from '../../components/FilterComponent';
import { useNavigate } from 'react-router-dom';
import '../../styles/Gerenciamento.css';

const VendaPage = () => {
  const { vendas, loading, removeVenda } = useVenda();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [tipoVendaFilter, setTipoVendaFilter] = useState('');
  const [tipoFaturamentoFilter, setTipoFaturamentoFilter] = useState('');
  const [tipoMoedaFilter, setTipoMoedaFilter] = useState('');
  
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  const filteredVendas = vendas.filter((venda) => {
    const matchesTipoVenda = tipoVendaFilter ? venda.tipo_venda === tipoVendaFilter : true;
    const matchesTipoFaturamento = tipoFaturamentoFilter ? venda.tipo_faturamento === tipoFaturamentoFilter : true;
    const matchesTipoMoeda = tipoMoedaFilter ? venda.moeda === tipoMoedaFilter : true;
    return matchesTipoVenda && matchesTipoFaturamento && matchesTipoMoeda;
  });

  const handleAddVenda = () => {
    navigate(`/venda/create`);
  };

  const handleEditVenda = (id_venda) => {
    navigate(`/venda/update/${id_venda}`);
  };

  const handleViewVenda = (id_venda) => {
    navigate(`/venda/view/${id_venda}`);
  };

  const handleDeleteVenda = async (id_venda) => {
    await removeVenda(id_venda);
    setAlertMessage("Venda deletada com sucesso!");
    setAlertVariant("success");
  };

  const columns = ['id_venda', 'tipo_venda', 'tipo_faturamento', 'valor_total', 'moeda', 'valor_convertido', 'id_cliente', 'id_fornecedor'];

  const actions = {
    view: handleViewVenda,
    update: handleEditVenda,
    delete: handleDeleteVenda,
  };

  const tipoVendaOptions = [
    { value: 'Transacional', label: 'Transacional' },
    { value: 'Recorrente', label: 'Recorrente' },
  ];

  const tipoFaturamentoOptions = [
    { value: 'Empresa', label: 'Empresa' },
    { value: 'Fornecedor', label: 'Fornecedor' },
  ];

  const tipoMoedaOptions = [
    { value: 'BRL', label: 'BRL' },
    { value: 'USD', label: 'USD' },
  ];

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Vendas</h2>

            <div className="filters-section">
              <FilterComponent
                filterOptions={tipoVendaOptions}
                filterLabel="Tipo de Venda"
                onFilterChange={setTipoVendaFilter}
                selectedFilter={tipoVendaFilter}
              />
              <FilterComponent
                filterOptions={tipoFaturamentoOptions}
                filterLabel="Tipo de Faturamento"
                onFilterChange={setTipoFaturamentoFilter}
                selectedFilter={tipoFaturamentoFilter}
              />
              <FilterComponent
                filterOptions={tipoMoedaOptions}
                filterLabel="Tipo de Moeda"
                onFilterChange={setTipoMoedaFilter}
                selectedFilter={tipoMoedaFilter}
              />
            </div>

          {(userPermission === 'Admin' || userPermission === 'User') && (
            <button className="custom-button" onClick={handleAddVenda}>
              Adicionar Venda
            </button>
          )}
        </div>

        {alertMessage && (
          <Alert className="alert-success" variant={alertVariant} onClose={() => setAlertMessage("")} dismissible>
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : filteredVendas.length === 0 ? (
          <Alert className="alert-error" variant="warning">Nenhuma venda encontrada.</Alert>
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
              {filteredVendas.map((venda) => (
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
