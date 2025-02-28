import React, { useState } from "react";
import { Form, Card, Alert, Spinner, Button } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo_marcelo_developer.png";
import useLogin from "../hooks/useLogin";
import "../styles/Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-logo-container">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <img
            src={logo}
            alt="Logo Marcelo Desenvolvedor"
            className="logo-dev"
          />
        </a>
      </div>
      <Card className="login-card-custom">
        <Card.Header className="login-card-header-custom">
          <h4>Login</h4>
        </Card.Header>
        <Card.Body className="login-card-body">
          {error && (
            <Alert className="login-alert-custom" variant="danger">
              {error}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="login-form-label">Email</Form.Label>
              <div className="login-email-container">
                <Form.Control
                  type="email"
                  placeholder="Digite seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-form-control-custom"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className="login-form-label">Senha</Form.Label>
              <div className="login-password-container">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-form-control-custom"
                  required
                />
                <Button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </div>
              <div className="login-forgot-password">
                <a href="/request-password">Esqueceu a senha?</a>
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="login-button-custom"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Carregando...</span>
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;
