import React, { useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RequestPasswordPage from './pages/RequestPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import InvalidTokenPage from './pages/InvalidTokenPage';
import ClientePage from './pages/ClientePage';
import VendedorPage from './pages/VendedorPage';
import FornecedorPage from './pages/FornecedorPage';
import VendaPage from './pages/VendaPage';
import ProdutoPage from './pages/ProdutoPage';
import ViewPage from './pages/ViewPage';
import NotFoundPage from './pages/NotFoundPage';
import { useEntityContext } from './context/EntityContext';

const EntityViewWrapper = () => {
  const { entity, id } = useParams();
  const { changeEntity, entityConfig } = useEntityContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!entity || !id) {
      navigate('/404');
      return;
    }

    if (entityConfig.entityName.toLowerCase() !== entity) {
      changeEntity(entity);
    }
  }, [entity, id, changeEntity, navigate]);

  return (
    <ViewPage
      entityName={entityConfig.entityName}
      fetchUrl={`${entityConfig.fetchUrl}/${id}`}
      fields={entityConfig.fields}
    />
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<HomePage />} />
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/request-password" element={<RequestPasswordPage />} />
      <Route exact path="/reset-password" element={<ResetPasswordPage />} />
      <Route exact path="/invalid-token" element={<InvalidTokenPage />} />
      <Route exact path="/clientes" element={<ClientePage />} />
      <Route exact path="/vendedores" element={<VendedorPage />} />
      <Route exact path="/fornecedores" element={<FornecedorPage />} />
      <Route exact path="/vendas" element={<VendaPage />} />
      <Route exact path="/produtos" element={<ProdutoPage />} />
      <Route exact path="/:entity/view/:id" element={<EntityViewWrapper />} />
      <Route exact path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
