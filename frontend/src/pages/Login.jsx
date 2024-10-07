import React, { useState } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.png';
import useLogin from '../hooks/useLogin';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    const { login, loading, error } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className="login-container">
            <div className="logo-container">
                <img src={logo} alt="Viper IT logo" className="viper-logo" />
            </div>
            <Card className="card-custom">
                <Card.Header className="card-header-custom">
                    <h4>Login</h4>
                </Card.Header>
                <Card.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label className="form-label">Email</Form.Label>
                            <div className="email-container">
                                <Form.Control
                                    type="email"
                                    placeholder="Digite seu email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control-custom"
                                    required
                                />
                            </div>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label className="form-label">Senha</Form.Label>
                            <div className="password-container">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control-custom"
                                    required
                                />
                                <button 
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </button>
                            </div>
                            <div className="forgot-password">
                                <a href="/requestpassword">Esqueceu a senha?</a>
                            </div>
                        </Form.Group>

                        <Button type="submit" className="button-custom" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Entrar"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;
