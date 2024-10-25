import React, { useState } from 'react';
import { Card, Spinner, Alert, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import useItemVenda from '../../hooks/useItemVenda';
import MainLayout from '../../layouts/MainLayout';
import "../../styles/ItemVenda.css"

const AddItemVenda = () => {
  const { addItemVenda } = useItemVenda();
  const [itemvendaData, setItemVendaData] = useState({ id_venda: '', id_produto: '', quantidade: '', preco_unitario: '', subtotal: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemVendaData({
      ...itemvendaData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!itemvendaData.id_venda) newErrors.id_venda = "Id de Venda é obrigatório";
    if (!itemvendaData.id_produto) newErrors.id_produto = "Id do Produto é obrigatório";
    if (!itemvendaData.quantidade || itemvendaData.quantidade <= 0) newErrors.quantidade = "Quantidade inválido";
    if (!itemvendaData.preco_unitario || itemvendaData.preco_unitario <= 0) newErrors.preco_unitario = "Preço Unitário inválido";
    if (!itemvendaData.subtotal || itemvendaData.subtotal <= 0) newErrors.subtotal = "Subtotal inválido";
    
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
      await addItemVenda({
        ...itemvendaData,
      });
      setSuccess('Item Venda adicionado com sucesso!');
      setItemVendaData({ descricao: '', valor: '', id_venda: '' });
    } catch (error) {
      setErrors({ form: error.message || 'Erro ao adicionar o Item Venda. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="item-venda-div">
        <Container className='item-venda-container'>
            <Row className='justify-content-md-center'>
                <Col md={12} lg={10}>
                    <Card className="item-venda-card">
                    <Card.Header className="item-venda-card-header">
                        <h4>+ Adicionar Item Venda</h4>
                    </Card.Header>
                    <Card.Body className="item-venda-card-body">
                        {loading && (
                        <div className="item-venda-spinner">
                            <Spinner animation="border" />
                        </div>
                        )}
                        {errors.form && (
                        <Alert variant="danger" className="item-venda-alert-error">
                            {errors.form}
                        </Alert>
                        )}
                        {success && (
                        <Alert variant="success" className="item-venda-alert-success">
                            {success}
                        </Alert>
                        )}
                        <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                            <Form.Group className="item-venda-form-group" controlId="id_venda">
                                <Form.Label className='item-venda-form-label'>ID da Venda</Form.Label>
                                <Form.Control
                                className="item-venda-form-control-custom"
                                type="number"
                                name="id_venda"
                                value={itemvendaData.id_venda}
                                onChange={handleChange}
                                isInvalid={!!errors.id_venda}
                                placeholder="Digite o ID da Venda"
                                step="1"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.id_venda}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="item-venda-form-group" controlId="id_produto">
                                <Form.Label className='item-venda-form-label'>ID do Produto</Form.Label>
                                <Form.Control
                                className="item-venda-form-control-custom"
                                type="number"
                                name="id_produto"
                                value={itemvendaData.id_produto}
                                onChange={handleChange}
                                isInvalid={!!errors.id_produto}
                                placeholder="Digite o ID do Produto"
                                step="1"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.id_produto}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="item-venda-form-group" controlId="quantidade">
                                <Form.Label className='item-venda-form-label'>Quantidade</Form.Label>
                                <Form.Control
                                className="item-venda-form-control-custom"
                                type="number"
                                name="quantidade"
                                value={itemvendaData.quantidade}
                                onChange={handleChange}
                                isInvalid={!!errors.quantidade}
                                placeholder="Digite a Quantidade de Itens Vendidos"
                                step="1"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.quantidade}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="item-venda-form-group" controlId="preco_unitario">
                                <Form.Label className='item-venda-form-label'>Preço Unitário</Form.Label>
                                <Form.Control
                                className="item-venda-form-control-custom"
                                type="number"
                                name="preco_unitario"
                                value={itemvendaData.preco_unitario}
                                onChange={handleChange}
                                isInvalid={!!errors.preco_unitario}
                                placeholder="Digite o Preço Unitário do Item Vendido"
                                step="0.01"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.preco_unitario}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="item-venda-form-group" controlId="subtotal">
                                <Form.Label className='item-venda-form-label'>Subtotal</Form.Label>
                                <Form.Control
                                className="item-venda-form-control-custom"
                                type="number"
                                name="subtotal"
                                value={itemvendaData.subtotal}
                                onChange={handleChange}
                                isInvalid={!!errors.subtotal}
                                placeholder="Digite o Subtotal dos Itens Vendidos"
                                step="0.01"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.subtotal}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>


                        </Row>
                        <div className="button-container">
                            <Button className="item-venda-button-container" variant="primary" type="submit" disabled={loading}>
                            <FaSave className="me-2" />
                            {loading ? 'Salvando...' : ' Salvar Item Venda'}
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

export default AddItemVenda;
