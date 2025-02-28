import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/invalid-token-page.css";

const InvalidTokenPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/request-password");
  };

  return (
    <div className="invalid-token-container">
      <h1>Token Inválido</h1>
      <h4>O token para redefinir sua senha é inválido ou expirou.</h4>
      <p>
        Solicite um novo link de redefinição de senha ou entre em contato com o
        suporte para obter mais assistência.
      </p>
      <Button className="invalid-token-button" onClick={handleGoBack}>
        Solicitar nova senha
      </Button>
    </div>
  );
};

export default InvalidTokenPage;
