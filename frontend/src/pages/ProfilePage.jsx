import React, { useState, useEffect } from 'react';
import { Button, Form, Col, Row, Container, Card } from 'react-bootstrap';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/Profile.css';

const getInitials = (name) => {
    return name && name.length > 0 ? name.charAt(0).toUpperCase() : 'U';
};

function ProfilePage() {
    const [userName, setUserName] = useState("Usuário");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const storedUserName = localStorage.getItem('user_username') || 'Usuário';
        const storedUserEmail = localStorage.getItem('user_email') || '';

        setUserName(storedUserName);
        setUserEmail(storedUserEmail);
    }, []);

    return (
        <Container className="profile-container">
            <Card className="profile-card">
                <Card.Body>
                    <div className="profile-header">
                        <div className="profile-avatar">
                            <FaUserCircle size={120} className="default-avatar" />
                            <div className="avatar-initials-large">{getInitials(userName)}</div>
                        </div>
                        <div className="profile-info">
                            <h4>{userName}</h4>
                            <p>{userEmail}</p>
                            <Button as={Link} to="/editprofile" className="btn-action">
                                <FaEdit className="icon" /> Editar Perfil
                            </Button>
                        </div>
                    </div>
                </Card.Body>
                {/* <Card.Body>
                    <h3 className="preferences-title">Preferências</h3>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="formLanguage">
                                    <Form.Label>Idioma</Form.Label>
                                    <Form.Control as="select" className="form-select">
                                        <option>Português</option>
                                        <option>Inglês</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formTheme">
                                    <Form.Label>Tema</Form.Label>
                                    <Form.Control as="select" className="form-select">
                                        <option>Claro</option>
                                        <option>Escuro</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button type="submit" className="save-preferences">Salvar Preferências</Button>
                    </Form>
                </Card.Body> */}
                    <div className="back-login-profile">
                        <a href="/clientes">Voltar</a>
                    </div>
            </Card>

        </Container>
    );
}

export default ProfilePage;
