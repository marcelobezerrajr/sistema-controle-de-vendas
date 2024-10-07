import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer'; 
import logo from '../assets/logo.png';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar expand="lg" className="home-navbar">
        <Navbar.Brand href="/">
          <img src={logo} alt="Logo ViperIT" className="viper-logo" />
        </Navbar.Brand>
        <div className="home-buttons">
          <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>
          <Button variant="outline-primary" onClick={() => alert('Entrando em Contato!')}>
            Entre em Contato
          </Button>
        </div>
      </Navbar>

      <header className="home-header">
        <h1>Bem-vindo ao Sistema de Controle de Vendas ViperIT!</h1>
        <h4>Empoderando negócios com soluções tecnológicas inovadoras</h4>
      </header>

      <div className="features">
        <div className="feature">
          <h2>Gestão de Clientes</h2>
          <p>Gerencie seus clientes de forma eficiente com ferramentas intuitivas.</p>
        </div>
        <div className="feature">
          <h2>Monitoramento de Vendas</h2>
          <p>Acompanhe e analise os dados de vendas em tempo real.</p>
        </div>
        <div className="feature">
          <h2>Inventário de Produtos</h2>
          <p>Mantenha seus produtos organizados e atualizados.</p>
        </div>
        <div className="feature">
          <h2>Comissões</h2>
          <p>Acompanhe comissões com transparência e análises detalhadas.</p>
        </div>
        <div className="feature">
          <h2>Controle de Custos</h2>
          <p>Monitore suas despesas e controle os custos de forma eficaz.</p>
        </div>
        <div className="feature">
          <h2>Gestão de Fornecedores</h2>
          <p>Gerencie seus fornecedores para uma operação mais eficiente.</p>
        </div>
        <div className="feature">
          <h2>Itens Vendidos</h2>
          <p>Análise detalhada dos itens vendidos para insights profundos.</p>
        </div>
        <div className="feature">
          <h2>Gestão de Parcelas</h2>
          <p>Controle as vendas parceladas e acompanhe seu progresso.</p>
        </div>
        <div className="feature">
          <h2>Gestão de Vendas e Vendedores</h2>
          <p>Acompanhe as vendas realizadas por cada vendedor e monitore.</p>
        </div>
        <div className="feature">
          <h2>Desempenho dos Vendedores</h2>
          <p>Gerencie e monitore o desempenho dos vendedores com eficiência.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
