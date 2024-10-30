import React, { useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ChangePassword from './pages/ChangePasswordPage';
import RequestPasswordPage from './pages/RequestPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import InvalidTokenPage from './pages/InvalidTokenPage';
import ClientePage from './pages/Cliente/ClientePage';
import AddCliente from './pages/Cliente/AddCliente';
import UpdateCliente from './pages/Cliente/UpdateCliente';
import VendedorPage from './pages/Vendedor/VendedorPage';
import AddVendedor from './pages/Vendedor/AddVendedor';
import UpdateVendedor from './pages/Vendedor/UpdateVendedor';
import FornecedorPage from './pages/Fornecedor/FornecedorPage';
import AddFornecedor from './pages/Fornecedor/AddFornecedor';
import UpdateFornecedor from './pages/Fornecedor/UpdateFornecedor';
import VendaPage from './pages/Venda/VendaPage';
import AddVenda from './pages/Venda/AddVenda';
import UpdateVenda from './pages/Venda/UpdateVenda';
import ProdutoPage from './pages/Produto/ProdutoPage';
import AddProduto from './pages/Produto/AddProduto';
import UpdateProduto from './pages/Produto/UpdateProduto';
import ViewPage from './pages/ViewPage';
import ComissaoPage from './pages/Comissao/ComissaoPage';
import AddComissao from './pages/Comissao/AddComissao';
import CustoPage from './pages/Custo/CustoPage';
import AddCusto from './pages/Custo/AddCusto';
import ParcelaPage from './pages/Parcela/ParcelaPage';
import AddParcela from './pages/Parcela/AddParcela';
import UpdateParcela from './pages/Parcela/UpdateParcela';
import UsuarioPage from './pages/Usuario/UsuarioPage';
import AddUsuario from './pages/Usuario/AddUsuario';
import UpdateUsuario from './pages/Usuario/UpdateUsuario';
import ItemVendaPage from './pages/ItemVenda/ItemVendaPage';
import AddItemVenda from './pages/ItemVenda/AddItemVenda';
import VendaVendedorPage from './pages/VendaVendedor/VendaVendedorPage';
import AddVendaVendedor from './pages/VendaVendedor/AddVendaVendedor';
import ProfilePage from './pages/ProfilePage';
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
  }, [entity, id, entityConfig.entityName, changeEntity, navigate]);

  if (!entityConfig.entityName) {
    return <div>Carregando...</div>;
  }

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
      <Route exact path="/change-password" element={<ChangePassword />} />
      <Route exact path="/clientes" element={<ClientePage />} />
      <Route exact path="/cliente/create" element={<AddCliente />} />
      <Route exact path="/cliente/update/:id_cliente" element={<UpdateCliente />} />
      <Route exact path="/vendedores" element={<VendedorPage />} />
      <Route exact path="/vendedor/create" element={<AddVendedor />} />
      <Route exact path="/vendedor/update/:id_vendedor" element={<UpdateVendedor />} />
      <Route exact path="/fornecedores" element={<FornecedorPage />} />
      <Route exact path="/fornecedor/create" element={<AddFornecedor />} />
      <Route exact path="/fornecedor/update/:id_fornecedor" element={<UpdateFornecedor />} />
      <Route exact path="/vendas" element={<VendaPage />} />
      <Route exact path="/venda/create" element={<AddVenda />} />
      <Route exact path="/venda/update/:id_venda" element={<UpdateVenda />} />
      <Route exact path="/produtos" element={<ProdutoPage />} />
      <Route exact path="/produto/update/:id_produto" element={<UpdateProduto />} />
      <Route exact path="/produto/create" element={<AddProduto />} />
      <Route exact path="/comissoes" element={<ComissaoPage />} />
      <Route exact path="/comissao/create" element={<AddComissao />} />
      <Route exact path="/custos" element={<CustoPage />} />
      <Route exact path="/custo/create" element={<AddCusto />} />
      <Route exact path="/parcelas" element={<ParcelaPage />} />
      <Route exact path="/parcela/create" element={<AddParcela />} />
      <Route exact path="/parcela/update/:id_parcela" element={<UpdateParcela />} />
      <Route exact path="/users" element={<UsuarioPage />} />
      <Route exact path="/user/create" element={<AddUsuario />} />
      <Route exact path="/user/update/:id_user" element={<UpdateUsuario />} />
      <Route exact path="/item-venda" element={<ItemVendaPage />} />
      <Route exact path="/item-venda/create" element={<AddItemVenda />} />
      <Route exact path="/venda-vendedor" element={<VendaVendedorPage />} />
      <Route exact path="/venda-vendedor/create" element={<AddVendaVendedor />} />
      <Route exact path="/perfil" element={<ProfilePage />} />
      <Route exact path="/:entity/view/:id" element={<EntityViewWrapper />} />
      <Route exact path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
