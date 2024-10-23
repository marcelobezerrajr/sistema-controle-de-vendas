import React, { useState, useEffect, useRef } from 'react';
import { Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaUsers, FaKey, FaShoppingCart, FaBoxOpen, FaUserTie, FaCaretDown } from 'react-icons/fa';
import logo from '../assets/logo.png';
import '../styles/Header.css';

function Header() {
  const [userUsername, setUserUsername] = useState("Username");
  const [userEmail, setUserEmail] = useState(null);
  const [userPermission, setUserPermission] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [vendasDropdownOpen, setVendasDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const vendasDropdownRef = useRef(null);

  useEffect(() => {
    const storedUserUsername = localStorage.getItem('user_username') || 'Username';
    const storedUserEmail = localStorage.getItem('user_email') || '';
    const storedUserPermission = localStorage.getItem('user_permission') || '';

    setUserUsername(storedUserUsername);
    setUserEmail(storedUserEmail);
    setUserPermission(storedUserPermission);
  }, []);

  const getInitials = (username) => {
    return username && username.length > 0 ? username.charAt(0).toUpperCase() : 'U';
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_permission');
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleVendasDropdown = () => {
    setVendasDropdownOpen(!vendasDropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
    if (vendasDropdownRef.current && !vendasDropdownRef.current.contains(e.target)) {
      setVendasDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen || vendasDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen, vendasDropdownOpen]);

  return (
    <Navbar expand="lg" className="header">
      <div className="header-left">
        <img src={logo} alt="ViperIT Logo" className="header-logo" />
      </div>
      <nav className="header-nav">
        <Link to="/clientes">Clientes</Link>
        <div className="vendas-dropdown-container" ref={vendasDropdownRef}>
          <span className="vendas-link" onClick={toggleVendasDropdown}>
            Vendas <FaCaretDown className={`caret-icon ${vendasDropdownOpen ? 'open' : ''}`} />
          </span>
          {vendasDropdownOpen && (
            <div className="custom-vendas-dropdown-menu">
              <Link to="/vendas" className="dropdown-item">
                <FaShoppingCart className="me-2" /> Vendas
              </Link>
            <NavDropdown.Divider />
              <Link to="/item-venda" className="dropdown-item">
                <FaBoxOpen className="me-2" /> Item Venda
              </Link>
            <NavDropdown.Divider />
              <Link to="/venda-vendedor" className="dropdown-item">
                <FaUserTie className="me-2" /> Venda Vendedor
              </Link>
            </div>
          )}
        </div>
        <Link to="/vendedores">Vendedores</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/fornecedores">Fornecedores</Link>
        <Link to="/comissoes">Comissões</Link>
        <Link to="/custos">Custos</Link>
        <Link to="/parcelas">Parcelas</Link>
      </nav>

      <div className="user-avatar-container" ref={dropdownRef}>
        <span className="avatar-link" onClick={toggleDropdown}>
          <div className="user-initials-icon">
            {getInitials(userUsername)}
          </div>
        </span>
        {dropdownOpen && (
          <div className="custom-user-dropdown-menu">
            <div className="dropdown-user-info">
              <strong>{userUsername !== 'Username' ? userUsername : userEmail}</strong>
              {userEmail && <p>{userEmail}</p>}
            </div>
            <NavDropdown.Divider />
            <NavDropdown.Item as={Link} to="/perfil">
              <FaUser className="me-2" /> Perfil
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/change-password">
              <FaKey className="me-2" /> Alterar Senha
            </NavDropdown.Item>
            {(userPermission === 'Admin' || userPermission === 'User') && (
              <NavDropdown.Item as={Link} to="/users">
                <FaUsers className="me-2" /> Usuários
              </NavDropdown.Item>
            )}
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Sair
            </NavDropdown.Item>
          </div>
        )}
      </div>
    </Navbar>
  );
}

export default Header;
