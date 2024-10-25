import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import useFornecedores from '../../hooks/useFornecedor';
import MainLayout from '../../layouts/MainLayout';
import "../../styles/Fornecedor.css";

const UpdateFornecedor = () => {
  const { id_fornecedor } = useParams()
  const { getFornecedor, updateFornecedorData } = useFornecedores();
  const [fornecedorData, setFornecedorData] = useState({ nome_fornecedor: '', percentual_comissao: '', impostos: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!id_fornecedor) {
      setErrors({ form: 'ID de fornecedor não definido.' });
      return;
    }

    const fetchfornecedor = async () => {
      setLoading(true);
      try {
        const data = await getFornecedor(id_fornecedor);
        setFornecedorData(data);
      } catch (error) {
        setErrors({ form: 'Erro ao carregar os dados do fornecedor.' });
      } finally {
        setLoading(false);
      }
    };
    fetchfornecedor();
  }, [id_fornecedor, getFornecedor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFornecedorData({
      ...fornecedorData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fornecedorData.nome_fornecedor) newErrors.nome_fornecedor = "Nome do Forncedor é obrigatório";
    if (!fornecedorData.percentual_comissao) newErrors.percentual_comissao = "Percentual Comissão é obrigatório";
    if (!fornecedorData.impostos) newErrors.impostos = "Imposto é obrigatório";
    
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

    try {
      await updateFornecedorData(id_fornecedor, fornecedorData);
      setSuccess('Fornecedor atualizado com sucesso!');
    } catch (error) {
      setErrors({ form: 'Erro ao atualizar o fornecedor. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="fornecedor-div">
        <Container className='fornecedor-container'>
            <Row className='justify-content-md-center'>
                <Col md={12} lg={10}>
                    <Card className="fornecedor-card">
                    <Card.Header className="fornecedor-card-header">
                        <h4>Atualizar Fornecedor</h4>
                    </Card.Header>
                    <Card.Body className="fornecedor-card-body">
                        {loading && (
                        <div className="fornecedor-spinner">
                            <Spinner animation="border" />
                        </div>
                        )}
                        {errors.form && (
                        <Alert variant="danger" className="fornecedor-alert-error">
                            {errors.form}
                        </Alert>
                        )}
                        {success && (
                        <Alert variant="success" className="fornecedor-alert-success">
                            {success}
                        </Alert>
                        )}
                        <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                            <Form.Group className="fornecedor-form-group" controlId="nome_fornecedor">
                                <Form.Label className="fornecedor-form-label">Nome</Form.Label>
                                <Form.Control
                                className="fornecedor-form-control-nome-custom"
                                type="text"
                                name="nome_fornecedor"
                                value={fornecedorData.nome_fornecedor}
                                onChange={handleChange}
                                isInvalid={!!errors.nome_fornecedor}
                                placeholder="Digite o Nome"
                                />
                                <Form.Control.Feedback type="invalid">{errors.nome_fornecedor}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="venda-form-group" controlId="percentual_comissao">
                                <Form.Label className='venda-form-label'>Percentual de Comissão</Form.Label>
                                <Form.Control
                                className="fornecedor-form-control-percentual-custom"
                                type="number"
                                name="percentual_comissao"
                                value={fornecedorData.percentual_comissao}
                                onChange={handleChange}
                                isInvalid={!!errors.percentual_comissao}
                                placeholder="Digite o Percentual de Comissão"
                                step="0.01"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.percentual_comissao}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="venda-form-group" controlId="impostos">
                                <Form.Label className='venda-form-label'>Imposto</Form.Label>
                                <Form.Control
                                className="fornecedor-form-control-custom"
                                type="number"
                                name="impostos"
                                value={fornecedorData.impostos}
                                onChange={handleChange}
                                isInvalid={!!errors.impostos}
                                placeholder="Digite o Valor do Imposto"
                                step="0.01"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.impostos}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                        </Row>
                        <div className="button-container">
                            <Button className="fornecedor-button-container" variant="primary" type="submit" disabled={loading}>
                            <FaSave className="me-2" />
                            {loading ? 'Salvando...' : ' Salvar Fornecedor'}
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

export default UpdateFornecedor;
