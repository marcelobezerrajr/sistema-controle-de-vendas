import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/home.css';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="home-container"
    >
      <header className="home-header">
        <h1 className="home-title">Bem-vindo a ViperIT</h1>
        <p className="home-subtitle">Sistema de controle de Vendas</p>
      </header>
      
      <motion.section
        className="cta-section"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Link to="/login" className="cta-button">
          Acessar Sistema
        </Link>
      </motion.section>
      
      <footer className="home-footer">
        <p>© 2024 ViperIT - Inovação e Tecnologia</p>
      </footer>
    </motion.div>
  );
};

export default Home;
