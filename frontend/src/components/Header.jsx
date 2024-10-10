import React, { useState, useEffect } from 'react';
import { Navbar, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Header.css';

function Header() {

  const [userUsername, setUserUsername] = useState("Username");
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const storedUserUsername = localStorage.getItem('user_username') || 'Username';
    const storedUserEmail = localStorage.getItem('user_email') || '';

    setUserUsername(storedUserUsername);
    setUserEmail(storedUserEmail);
  }, []);

  const getInitials = (usename) => {
    return usename && usename.length > 0 ? usename.charAt(0).toUpperCase() : 'U';
  };

  const handleLogout = () => {
    localStorage.removeItem('user_username');
    localStorage.removeItem('user_email');
    navigate('/login');
};

  return (
    <Navbar expand="lg" className="header">
      <div className="header-left">
        <img src={logo} alt="ViperIT Logo" className="header-logo" />
      </div>
      <nav className="header-nav">
        <Link to="/clientes">Clientes</Link>
        <Link to="/vendas">Vendas</Link>
        <Link to="/vendedores">Vendedores</Link>
        <Link to="/produtos">Produtos</Link>
        <Link to="/fornecedores">Fornecedores</Link>
        <Link to="/comissoes">Comissões</Link>
        <Link to="/custos">Custos</Link>
        <Link to="/parcelas">Parcelas</Link>
        <NavDropdown
          // title={
          //   <span className="d-flex align-items-center avatar-link">
          //     <div className="user-initials-icon">
          //       {getInitials(userUsername)}
          //     </div>
          //     <span className="user-info">
          //       {userUsername !== 'Username' ? userUsername : userEmail}
          //     </span>
          //     </span>
          // }
          id="user-nav-dropdown"
          className="custom-user-dropdown"
          >
          <div className="dropdown-user-info">
            <strong>{userUsername !== 'Username' ? userUsername : userEmail}</strong>
            {userEmail && <p>{userEmail}</p>}
          </div>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/changepassword">Change Password</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
      </nav>
    </Navbar>
  );
};

export default Header;
