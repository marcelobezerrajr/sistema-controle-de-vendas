import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Marcelo Desenvolvedor. Todos os direitos
        reservados.
      </p>
      <p>Capacitando empresas com soluções tecnológicas inovadoras.</p>
    </footer>
  );
};

export default Footer;
