import React from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useChangePassword from '../hooks/useChangePassword';
import '../styles/ChangePassword.css'

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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleChangePassword();
  };

  return (
    <div className="register-container">
      <Card className="card-custom">
        <Card.Header className="card-header-custom">
          <h4>Change Password</h4>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Current Password</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={showPasswords.currentPassword ? 'text' : 'password'}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="form-control-custom"
                />
                <Button
                  variant="link"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                >
                  {showPasswords.currentPassword ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={showPasswords.newPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control-custom"
                />
                <Button
                  variant="link"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('newPassword')}
                >
                  {showPasswords.newPassword ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={showPasswords.confirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control-custom"
                />
                <Button
                  variant="link"
                  className="password-toggle"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                >
                  {showPasswords.confirmPassword ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </div>
            </Form.Group>

            <Button variant="primary" type="submit" className="button-custom" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Change Password'}
            </Button>
          </Form>
          <div className="back-login">
            <a href="/customers">Back to Home</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChangePassword;
