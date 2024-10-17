import React, { useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RequestPasswordPage from './pages/RequestPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import InvalidTokenPage from './pages/InvalidTokenPage';
import ClientePage from './pages/Cliente/ClientePage';
import AddCliente from './pages/Cliente/AddCliente';
import UpdateCliente from './pages/Cliente/UpdateCliente';
import VendedorPage from './pages/Vendedor/VendedorPage';
import AddVendedor from './pages/Vendedor/AddVendedor';
import UpdateVendedor from './pages/Vendedor/UpdateVendedor';
import FornecedorPage from './pages/FornecedorPage';
import VendaPage from './pages/Venda/VendaPage';
import AddVenda from './pages/Venda/AddVenda';
import UpdateVenda from './pages/Venda/UpdateVenda';
import ProdutoPage from './pages/ProdutoPage';
import ViewPage from './pages/ViewPage';
import ComissaoPage from './pages/ComissaoPage';
import CustoPage from './pages/CustoPage';
import ParcelaPage from './pages/Parcela';
import UsuarioPage from './pages/UsuarioPage';
import ItemVendaPage from './pages/ItemVendaPage';
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
      <Route exact path="/cliente/create" element={<AddCliente />} />
      <Route exact path="/cliente/update/:id_cliente" element={<UpdateCliente />} />
      <Route exact path="/vendedores" element={<VendedorPage />} />
      <Route exact path="/vendedor/create" element={<AddVendedor />} />
      <Route exact path="/vendedor/update/:id_vendedor" element={<UpdateVendedor />} />
      <Route exact path="/fornecedores" element={<FornecedorPage />} />
      <Route exact path="/vendas" element={<VendaPage />} />
      <Route exact path="/venda/create" element={<AddVenda />} />
      <Route exact path="/venda/update/:id_venda" element={<UpdateVenda />} />
      <Route exact path="/produtos" element={<ProdutoPage />} />
      <Route exact path="/comissoes" element={<ComissaoPage />} />
      <Route exact path="/custos" element={<CustoPage />} />
      <Route exact path="/parcelas" element={<ParcelaPage />} />
      <Route exact path="/usuarios" element={<UsuarioPage />} />
      <Route exact path="/item-venda" element={<ItemVendaPage />} />
      <Route exact path="/:entity/view/:id" element={<EntityViewWrapper />} />
      <Route exact path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
