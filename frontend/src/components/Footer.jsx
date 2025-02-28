import React from "react";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} Marcelo Developer. Todos os direitos
        reservados.
      </p>
      <p>Capacitando empresas com soluções tecnológicas inovadoras.</p>
    </footer>
  );
};

export default Footer;
