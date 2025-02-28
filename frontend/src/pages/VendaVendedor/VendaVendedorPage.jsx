import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap";
import TableRow from "../../components/TableRow";
import SearchComponent from "../../components/SearchComponent";
import useVendaVendedor from "../../hooks/useVendaVendedor";
import MainLayout from "../../layouts/MainLayout";
import FilterComponent from "../../components/FilterComponent";
import { useNavigate } from "react-router-dom";
import "../../styles/Gerenciamento.css";

const VendaVendedorPage = () => {
  const { vendaVendedor, loading } = useVendaVendedor();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [tipoVendaVendedorFilter, setTipoVendaVendedorFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendaVendedores, setFilteredVendaVendedores] = useState([]);

  const navigate = useNavigate();
  const userPermission = localStorage.getItem("user_permission");

  useEffect(() => {
    const filtered = vendaVendedor.filter((vendavendedores) => {
      const matchesTipoVendedor = tipoVendaVendedorFilter
        ? vendavendedores.tipo_participacao === tipoVendaVendedorFilter
        : true;
      const matchesSearchTerm = searchTerm
        ? vendavendedores.id_vendedor.toString().includes(searchTerm)
        : true;

      return matchesTipoVendedor && matchesSearchTerm;
    });

    setFilteredVendaVendedores(filtered);
  }, [vendaVendedor, tipoVendaVendedorFilter, searchTerm]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleFilterChange = (filterValue) => {
    setTipoVendaVendedorFilter(filterValue);
  };

  const handleAddVendaVendedor = () => {
    navigate(`/venda-vendedor/create`);
  };

  const handleViewVendaVendedor = (id_venda, id_vendedor) => {
    const url = `/venda-vendedor/view/${id_venda}/${id_vendedor}`;
    console.log("Navigating to:", url); // Adicione este log para verificar
    navigate(url);
  };

  const columns = [
    "id_venda",
    "id_vendedor",
    "tipo_participacao",
    "percentual_comissao",
  ];

  const actions = {
    view: handleViewVendaVendedor,
  };

  const tipoVendaVendedorOptions = [
    { value: "Inside Sales", label: "Inside Sales" },
    { value: "Account Executive", label: "Account Executive" },
  ];

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section d-flex justify-content-between align-items-center">
          <h2>Gerenciamento de Vendas por Vendedor</h2>

          <div className="filters-section">
            <FilterComponent
              filterOptions={tipoVendaVendedorOptions}
              filterLabel="Tipo de Vendedor"
              onFilterChange={handleFilterChange}
              selectedFilter={tipoVendaVendedorFilter}
            />
          </div>

          <div className="actions-section d-flex align-items-center">
            <SearchComponent
              placeholder="Buscar vendedor..."
              onSearch={handleSearch}
            />

            {(userPermission === "Admin" || userPermission === "User") && (
              <button
                className="custom-button ml-2"
                onClick={handleAddVendaVendedor}
              >
                Adicionar Venda Vendedor
              </button>
            )}
          </div>
        </div>

        {alertMessage && (
          <Alert
            className={`alert-${alertVariant}`}
            variant={alertVariant}
            onClose={() => setAlertMessage("")}
          >
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : filteredVendaVendedores.length === 0 ? (
          <Alert className="alert-error" variant="warning">
            Nenhuma venda encontrada.
          </Alert>
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
              {filteredVendaVendedores.map((venda) => (
                <TableRow
                  key={venda.id_venda}
                  rowData={venda}
                  columns={columns}
                  actions={actions}
                  idField="id_venda"
                  secondaryIdField="id_vendedor"
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
