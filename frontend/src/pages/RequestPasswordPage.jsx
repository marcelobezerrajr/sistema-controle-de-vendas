import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import useRequestPassword from '../hooks/useRequestPassword';
import '../styles/RequestPassword.css';
import logo from '../assets/logo.png';


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
            <img src={logo} alt="Viper IT logo" className="request-viper-logo" />
          </a>
        </div>
      <Card className="request-card-custom">
        <Card.Header className="request-card-header-custom">
          <h4>Recuperar Senha</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
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
            <Button type="submit" className="request-button-custom" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Enviar'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RequestPasswordPage;
