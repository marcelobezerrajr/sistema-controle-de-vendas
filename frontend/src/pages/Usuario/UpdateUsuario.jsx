import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FaSave, FaEye, FaEyeSlash } from 'react-icons/fa';
import useUsuario from '../../hooks/useUsuario';
import MainLayout from '../../layouts/MainLayout';
import { useParams } from 'react-router-dom';
import "../../styles/Usuario.css";

const UpdateUsuario = () => {
  const { id_user } = useParams();
  const { getUsuario, updateUsuarioData } = useUsuario();
  const [usuarioData, setUsuarioData] = useState({ username: '', email: '', permission: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [userPermission, setUserPermission] = useState('');

    useEffect(() => {
        const permission = localStorage.getItem('user_permission');
        setUserPermission(permission || '');
    }, []);

  useEffect(() => {
    if (!id_user) {
      setErrors({ form: 'ID de usuário não definido.' });
      return;
    }

    const fetchUsuario = async () => {
      setLoading(true);
      try {
        const userData = await getUsuario(id_user);
        setUsuarioData(userData);
      } catch (error) {
        setErrors({ form: 'Erro ao carregar os dados do usuário.' });
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id_user, getUsuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuarioData({
      ...usuarioData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!usuarioData.username) newErrors.username = "Nome de Usuário é obrigatório";
    if (!usuarioData.email) newErrors.email = "Email é obrigatório";
    if (!usuarioData.permission) newErrors.permission = "Tipo de Permissão é obrigatório";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(null);
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }
  
    if (userPermission !== 'Admin' && usuarioData.permission === 'Admin') {
      setErrors({ permission: 'Você não tem permissão para atribuir o nível Admin.' });
      setLoading(false);
      return;
    }
  
    try {
      await updateUsuarioData(id_user, usuarioData);
      setSuccess('Usuário atualizado com sucesso!');
    } catch (error) {
      setErrors({ form: 'Erro ao atualizar o usuário. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };
  

    const getPermissionOptions = () => {
        if (userPermission === 'Admin') {
            return (
                <>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                    <option value="Read">Read</option>
                </>
            );
        }
        return (
            <>
                <option value="User">User</option>
                <option value="Read">Read</option>
            </>
        );
    };

  return (
    <MainLayout>
      <div className="usuario-div">
        <Container className='usuario-container'>
            <Row className='justify-content-md-center'>
                <Col md={12} lg={10}>
                    <Card className="usuario-card">
                    <Card.Header className="usuario-card-header">
                        <h4>Atualizar Usuário</h4>
                    </Card.Header>
                    <Card.Body className="usuario-card-body">
                        {loading && (
                        <div className="usuario-spinner">
                            <Spinner animation="border" />
                        </div>
                        )}
                        {errors.form && (
                        <Alert variant="danger" className="usuario-alert-error">
                            {errors.form}
                        </Alert>
                        )}
                        {success && (
                        <Alert variant="success" className="usuario-alert-success">
                            {success}
                        </Alert>
                        )}
                        <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                            <Form.Group className="usuario-form-group" controlId="username">
                                <Form.Label className="usuario-form-label">Nome de Usuário</Form.Label>
                                <Form.Control
                                className="usuario-form-control-custom"
                                type="text"
                                name="username"
                                value={usuarioData.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                                placeholder="Digite o Username"
                                />
                                <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="usuario-form-group" controlId="email">
                                <Form.Label className="usuario-form-label">Email</Form.Label>
                                <Form.Control
                                className="usuario-form-control-custom"
                                type="text"
                                name="email"
                                value={usuarioData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                placeholder="Digite o Email"
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="usuario-form-group" controlId="permission">
                                <Form.Label className='usuario-form-label'>Permissão</Form.Label>
                                <Form.Select
                                className="usuario-form-select-custom"
                                name="permission"
                                value={usuarioData.permission}
                                onChange={handleChange}
                                isInvalid={!!errors.permission}
                                required
                                >
                                <option value="">Selecionar Permissão do Usuário</option>
                                {getPermissionOptions()}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.permission}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                        </Row>
                        <div className="button-container">
                            <Button variant="primary" type="submit" disabled={loading}>
                            <FaSave className="me-2" />
                            {loading ? 'Salvando...' : ' Salvar Usuário'}
                            </Button>
                        </div>
                        </Form>
                    </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
      </div>
    </MainLayout>
  );
};

export default UpdateUsuario;
