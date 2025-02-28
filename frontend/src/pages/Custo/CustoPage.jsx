import React, { useState } from "react";
import { Table, Alert } from "react-bootstrap";
import useCusto from "../../hooks/useCusto";
import TableRow from "../../components/TableRow";
import MainLayout from "../../layouts/MainLayout";
import { useNavigate } from "react-router-dom";
import "../../styles/Gerenciamento.css";

const CustoPage = () => {
  const { custos, loading } = useCusto();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  const navigate = useNavigate();
  const userPermission = localStorage.getItem("user_permission");

  const handleAddCusto = async () => {
    navigate(`/custo/create`);
    setAlertVariant("success");
  };

  const handleViewCusto = async (id_custo) => {
    navigate(`/custo/view/${id_custo}`);
  };

  const columns = ["id_custo", "descricao", "valor", "id_venda"];

  const actions = {
    view: handleViewCusto,
  };

  return (
    <MainLayout>
      <div className="table-container">
        <div className="header-section">
          <h2>Gerenciamento de Custos</h2>

          {(userPermission === "Admin" || userPermission === "User") && (
            <button
              variant="primary"
              className="custom-button"
              onClick={handleAddCusto}
            >
              Adicionar Custo
            </button>
          )}
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
        ) : custos.length === 0 ? (
          <Alert className="alert-error" variant="warning">
            Nenhum custo encontrado.
          </Alert>
        ) : (
          <Table striped bordered hover className="custom-table">
            <thead>
              <tr>
                <th>ID Custo</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>ID Venda</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {custos.map((custo) => (
                <TableRow
                  key={custo.id_custo}
                  rowData={custo}
                  columns={columns}
                  actions={actions}
                  idField="id_custo"
                />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </MainLayout>
  );
};

export default CustoPage;
