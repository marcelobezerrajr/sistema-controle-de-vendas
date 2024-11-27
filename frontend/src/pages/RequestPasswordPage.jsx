import React, { useState } from 'react';
import { Form, Card, Alert, Spinner, Button } from 'react-bootstrap';
import useRequestPassword from '../hooks/useRequestPassword';
import logo from '../assets/logo_marcelo_desenvolvedor.png';
import '../styles/RequestPassword.css';

const RequestPasswordPage = () => {
  const { requestPassword, loading, error, successMessage } = useRequestPassword();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await requestPassword(email);
  };

  return (
    <div className="request-container">
        <div className="request-logo-container">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <img src={logo} alt="Logo Marcelo Desenvolvedor" className="request-logo-dev" />
          </a>
        </div>
      <Card className="request-card-custom">
        <Card.Header className="request-card-header-custom">
          <h4>Recuperar Senha</h4>
        </Card.Header>
        <Card.Body className="request-card-body">
          {error && <Alert className="request-alert-custom-error" variant="danger">{error}</Alert>}
          {successMessage && <Alert className="request-alert-custom-success" variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="request-form-label">Email</Form.Label>
              <div className="request-email-container">
                <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="request-form-control-custom"
                    required
                />
              </div>
            <div className="request-back-login">
                <a href="/login">Voltar para Login</a>
            </div>
            </Form.Group>
            <Button variant="primary" type="submit" className="request-button-custom" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="visually-hidden">Enviando...</span>
                </>
              ) : (
                "Enviar"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RequestPasswordPage;
