import React, { useState, useEffect } from "react";
import { Table, Alert } from "react-bootstrap";
import TableRow from "../../components/TableRow";
import SearchComponent from "../../components/SearchComponent";
import useUsuario from "../../hooks/useUsuario";
import MainLayout from "../../layouts/MainLayout";
import FilterComponent from "../../components/FilterComponent";
import { useNavigate } from "react-router-dom";
import "../../styles/Gerenciamento.css";

const UsuarioPage = () => {
  const { usuarios, loading, removeUsuario } = useUsuario();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [tipoUsuarioFilter, setTipoUsuarioFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);

  const navigate = useNavigate();
  const userPermission = localStorage.getItem("user_permission");

  useEffect(() => {
    const filtered = usuarios.filter((usuario) => {
      const matchesTipoUsuario = tipoUsuarioFilter
        ? usuario.permission === tipoUsuarioFilter
        : true;
      const matchesSearchTerm = searchTerm
        ? usuario.username.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchesTipoUsuario && matchesSearchTerm;
    });

    setFilteredUsuarios(filtered);
  }, [usuarios, tipoUsuarioFilter, searchTerm]);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleFilterChange = (filterValue) => {
    setTipoUsuarioFilter(filterValue);
  };

  const handleAddUsuario = async () => {
    navigate(`/user/create`);
  };

  const handleEditUsuario = async (id_user) => {
    navigate(`/user/update/${id_user}`);
  };

  const handleViewUsuario = async (id_user) => {
    navigate(`/user/view/${id_user}`);
  };

  const handleDeleteUsuario = async (id_user) => {
    await removeUsuario(id_user);
    setAlertMessage("Usuário deletado com sucesso!");
    setAlertVariant("success");
  };

  const columns = ["id_user", "username", "email", "permission"];

  const actions = {
    view: handleViewUsuario,
    update: handleEditUsuario,
    delete: handleDeleteUsuario,
  };

  const tipoUsuarioOptions = [
    { value: "Admin", label: "Admin" },
    { value: "User", label: "User" },
    { value: "Read", label: "Read" },
  ];

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section d-flex justify-content-between align-items-center">
          <h2>Gerenciamento de Usuários</h2>

          <div className="filters-section">
            <FilterComponent
              filterOptions={tipoUsuarioOptions}
              filterLabel="Permissão Usuário"
              onFilterChange={handleFilterChange}
              selectedFilter={tipoUsuarioFilter}
            />
          </div>

          <div className="actions-section d-flex align-items-center">
            <SearchComponent
              placeholder="Buscar usuários..."
              onSearch={handleSearch}
            />

            {(userPermission === "Admin" || userPermission === "User") && (
              <button
                variant="primary"
                className="custom-button"
                onClick={handleAddUsuario}
              >
                Adicionar Usuário
              </button>
            )}
          </div>
        </div>

        {alertMessage && (
          <Alert
            className="alert-success"
            variant={alertVariant}
            onClose={() => setAlertMessage("")}
          >
            {alertMessage}
          </Alert>
        )}

        {loading ? (
          <p>Carregando...</p>
        ) : !Array.isArray(filteredUsuarios) ||
          filteredUsuarios.length === 0 ? (
          <Alert className="alert-error" variant="warning">
            Nenhum usuário encontrado.
          </Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Usuário</th>
                <th>Nome de Usuário</th>
                <th>Email</th>
                <th>Permissão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsuarios.map((user) => (
                <TableRow
                  key={user.id_user}
                  rowData={user}
                  columns={columns}
                  actions={actions}
                  idField="id_user"
                />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default UsuarioPage;
