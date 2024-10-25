import React, { useState, useEffect } from 'react';
import { Table, Alert } from 'react-bootstrap';
import TableRow from '../../components/TableRow';
import SearchComponent from '../../components/SearchComponent';
import useVendaVendedor from '../../hooks/useVendaVendedor';
import MainLayout from '../../layouts/MainLayout';
import { useNavigate } from 'react-router-dom';
import "../../styles/Gerenciamento.css";

const VendaVendedorPage = () => {
  const { vendaVendedor, loading, addVendaVendedor, getVendaVendedor } = useVendaVendedor();
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');
  const [filteredVendas, setFilteredVendas] = useState([]);
  
  const navigate = useNavigate();
  const userPermission = localStorage.getItem('user_permission');

  useEffect(() => {
    setFilteredVendas(vendaVendedor);
  }, [vendaVendedor]);

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredVendas(vendaVendedor);
    } else {
      const filtered = vendaVendedor.filter(venda => 
        venda.tipo_participacao.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVendas(filtered);
    }
  };

  const handleAddVenda = () => {
    navigate(`/venda-vendedor/create`);
  };

  const handleEditVenda = (id) => {
    navigate(`/venda-vendedor/update/${id}`);
  };

  const handleViewVenda = (id) => {
    navigate(`/venda-vendedor/view/${id}`);
  };

  const handleDeleteVenda = async (id) => {
    try {
      await removeVenda(id);
      setAlertMessage("Venda do vendedor removida com sucesso!");
      setAlertVariant("success");
    } catch (error) {
      setAlertMessage("Erro ao remover a venda do vendedor.");
      setAlertVariant("danger");
    }
  };

  const columns = ['id_venda', 'id_vendedor', 'tipo_participacao', 'percentual_comissao'];

  const actions = {
    view: handleViewVenda,
    update: handleEditVenda,
    delete: handleDeleteVenda,
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section d-flex justify-content-between align-items-center">
          <h2>Gerenciamento de Vendas por Vendedor</h2>
          
          <div className="actions-section d-flex align-items-center">
            <SearchComponent placeholder="Buscar venda..." onSearch={handleSearch} />
            
            {(userPermission === 'Admin' || userPermission === 'User') && (
              <button className="custom-button ml-2" onClick={handleAddVenda}>
                Adicionar Venda
              </button>
            )}
          </div>
        </div>

        {alertMessage && (
          <Alert className={`alert-${alertVariant}`} variant={alertVariant} onClose={() => setAlertMessage("")}>
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
                <th>ID Vendedor</th>
                <th>Tipo de Participação</th>
                <th>Percentual de Comissão</th>
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

export default VendaVendedorPage;
