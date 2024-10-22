import React, { useState } from 'react';
import { Card, Form, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import MainLayout from '../layouts/MainLayout';
import useChangePassword from '../hooks/useChangePassword';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
  const {
    currentPassword,
    newPassword,
    confirmPassword,
    error,
    loading,
    message,
    showPasswords,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handleChangePassword,
    togglePasswordVisibility,
  } = useChangePassword();

  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateNewPassword = (password) => {
    if (password.length < 6) {
      return 'A senha deve ter pelo menos 6 caracteres';
    }
    if (!/[A-Z]/.test(password)) {
      return 'A senha deve conter pelo menos uma letra maiúscula';
    }
    if (!/[a-z]/.test(password)) {
      return 'A senha deve conter pelo menos uma letra minúscula';
    }
    if (!/\d/.test(password)) {
      return 'A senha deve conter pelo menos um número';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'A senha deve conter pelo menos um caractere especial';
    }
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'As senhas não coincidem';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateNewPassword(newPassword);
    const confirmError = validateConfirmPassword(newPassword, confirmPassword);

    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    if (confirmError) {
      setConfirmPasswordError(confirmError);
      return;
    }

    setPasswordError('');
    setConfirmPasswordError('');
    handleChangePassword();
  };

  return (
    <MainLayout>
      <div className="change-password-container">
        <Card className="change-password-card-custom">
          <Card.Header className="change-password-card-header-custom">
            <h4>Alterar a Senha</h4>
          </Card.Header>
          <Card.Body className="change-password-card-body">
            {error && <div className="change-password-error">{error}</div>}
            {passwordError && <div className="change-password-error">{passwordError}</div>}
            {message && <div className="change-password-success">{message}</div>}

            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label className="change-password-form-label">Senha Atual</Form.Label>
                <div className="change-password-password-container">
                  <Form.Control
                    type={showPasswords.currentPassword ? 'text' : 'password'}
                    placeholder="Senha Atual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="change-password-form-control-custom"
                  />
                  <button
                    type="button"
                    className="change-password-password-toggle"
                    onClick={() => togglePasswordVisibility('currentPassword')}
                  >
                    {showPasswords.currentPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label className="change-password-form-label">Nova Senha</Form.Label>
                <div className="change-password-password-container">
                  <Form.Control
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    placeholder="Nova Senha"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordError(validateNewPassword(e.target.value));
                    }}
                    className="change-password-form-control-custom"
                  />
                  <button
                    type="button"
                    className="change-password-password-toggle"
                    onClick={() => togglePasswordVisibility('newPassword')}
                  >
                    {showPasswords.newPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </Form.Group>

              <Form.Group>
                <Form.Label className="change-password-form-label">Confirmar Senha</Form.Label>
                <div className="change-password-password-container">
                  <Form.Control
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    placeholder="Confirmar Senha"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmPasswordError(validateConfirmPassword(newPassword, e.target.value));
                    }}
                    className="change-password-form-control-custom"
                  />
                  <button
                    type="button"
                    className="change-password-password-toggle"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                  >
                    {showPasswords.confirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </Form.Group>

              <button
                type="submit"
                className="change-password-button-custom"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Alterar Senha'}
              </button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ChangePassword;
