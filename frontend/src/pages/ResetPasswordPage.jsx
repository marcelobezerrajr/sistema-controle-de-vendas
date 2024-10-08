import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useResetPassword from '../hooks/useResetPassword';
import logo from '../assets/logo.png';
import '../styles/ResetPassword.css';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState({ newPassword: false, confirmPassword: false });
    const query = new URLSearchParams(useLocation().search);
    const token = query.get('access_token');
    const navigate = useNavigate();
    const { feedback, loading, verifyToken, handleResetPassword } = useResetPassword();

    useEffect(() => {
        if (token) {
            verifyToken(token);
        } else {
            navigate('/invalid-token');
        }
    }, [token, verifyToken, history]);

    const validatePassword = (password) => {
        if (password.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
        if (!/[A-Z]/.test(password)) return "A senha deve conter uma letra maiúscula.";
        if (!/[a-z]/.test(password)) return "A senha deve conter uma letra minúscula.";
        if (!/[0-9]/.test(password)) return "A senha deve conter um número.";
        if (!/[!@#$%^&*]/.test(password)) return "A senha deve conter um caractere especial.";
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validationError = validatePassword(newPassword);
        if (validationError) {
            return alert(validationError);
        }

        if (newPassword !== confirmPassword) {
            return alert("Passwords do not match.");
        }

        handleResetPassword(token, newPassword);
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="reset-container">
            <div className="reset-logo-container">
                <a href="/" target="_blank" rel="noopener noreferrer">
                    <img src={logo} alt="Viper IT logo" className="reset-viper-logo" />
                </a>
            </div>
            <Card className="reset-card-custom">
                <Card.Header className="reset-card-header-custom">
                    <h4>Redefinir senha</h4>
                </Card.Header>
                <Card.Body>
                    {feedback.message && (
                        <Alert variant={feedback.error ? "danger" : "success"}>
                            {feedback.message}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label className="reset-form-label">Nova Senha</Form.Label>
                            <div className="reset-password-container">
                                <Form.Control
                                    type={showPasswords.newPassword ? "text" : "password"}
                                    placeholder='Novas Senha'
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="reset-form-control-custom"
                                />
                                <Button 
                                    variant="link" 
                                    className="reset-password-toggle" 
                                    onClick={() => togglePasswordVisibility('newPassword')}
                                >
                                    {showPasswords.newPassword ? <FaEye /> : <FaEyeSlash />}
                                </Button>
                            </div>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="reset-form-label">Confirmar Senha</Form.Label>
                            <div className="reset-password-container">
                                <Form.Control
                                    type={showPasswords.confirmPassword ? "text" : "password"}
                                    placeholder="Confirmar Senha"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="reset-form-control-custom"
                                />
                                <Button 
                                    variant="link" 
                                    className="reset-password-toggle" 
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                >
                                    {showPasswords.confirmPassword ? <FaEye /> : <FaEyeSlash />}
                                </Button>
                            </div>
                        <div className="reset-back-login">
                            <a href="/login">Voltar para Login</a>
                        </div>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="reset-button-custom" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : "Reset Password"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ResetPasswordPage;
