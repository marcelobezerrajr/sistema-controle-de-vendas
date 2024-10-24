import React, { useState } from 'react';
import { Card, Spinner, Alert, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import useVendaVendedor from '../../hooks/useVendaVendedor';
import MainLayout from '../../layouts/MainLayout';
import "../../styles/VendaVendedor.css"

const AddVendaVendedor = () => {
  const { addVendaVendedor } = useVendaVendedor();
  const [vendavendedorData, setVendaVendedorData] = useState({ id_venda: '', id_vendedor: '', tipo_participacao: '', percentual_comissao: '' });
  const [percentualComissao, setPercentualComissao] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const calcularComissao = (tipo) => {
    if (tipo === 'Inside Sales') {
      return 7.5;
    } else if (tipo === 'Account Executive') {
      return 5.0;
    } else {
      return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendaVendedorData({
      ...vendavendedorData,
      [name]: value,
    });

    if (name === 'tipo_participacao') {
        const comissao = calcularComissao(value);
        setPercentualComissao(comissao);
      }

    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!vendavendedorData.id_venda) newErrors.id_venda = "ID da Venda é obrigatório";
    if (!vendavendedorData.id_vendedor) newErrors.id_vendedor = "ID do Vendedor é obrigatório";
    if (!vendavendedorData.tipo_participacao) newErrors.tipo_participacao = "Tipo de Participação é obrigatório";
    if (!vendavendedorData.percentual_comissao) newErrors.percentual_comissao = "Percentual de Comissão é obrigatório";
    
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
      await addVendaVendedor({
        ...vendavendedorData,
        percentual_comissao: percentualComissao
      });
      setSuccess('Venda Vendedor adicionada com sucesso!');
      setVendaVendedorData({
        id_venda: '', 
        id_vendedor: '', 
        tipo_participacao: '', 
        percentual_comissao: ''
      });
      setPercentualComissao('');
    } catch (error) {
      setErrors({ form: 'Erro ao adicionar a venda vendedor. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const getTipoParticipacaoVendaVendedorOptions = () => (
    <>
      <option value="Inside Sales">Inside Sales</option>
      <option value="Account Executive">Account Executive</option>
    </>
  );

  return (
    <MainLayout>
      <div className="venda-vendedor-div">
        <Container className='venda-vendedor-container'>
            <Row className='justify-content-md-center'>
                <Col md={12} lg={10}>
                    <Card className="venda-vendedor-card">
                    <Card.Header className="venda-vendedor-card-header">
                        <h4>+ Adicionar Venda Vendedor</h4>
                    </Card.Header>
                    <Card.Body className="venda-vendedor-card-body">
                        {loading && (
                        <div className="venda-vendedor-spinner">
                            <Spinner animation="border" />
                        </div>
                        )}
                        {errors.form && (
                        <Alert variant="danger" className="alert-error">
                            {errors.form}
                        </Alert>
                        )}
                        {success && (
                        <Alert variant="success" className="alert-success">
                            {success}
                        </Alert>
                        )}
                        <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                            <Form.Group className="venda-vendedor-form-group" controlId="id_venda">
                                <Form.Label className='venda-vendedor-form-label'>ID Venda</Form.Label>
                                <Form.Control
                                type="number"
                                name="id_venda"
                                value={vendavendedorData.id_venda}
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
                            <Form.Group className="venda-vendedor-form-group" controlId="id_vendedor">
                                <Form.Label className='venda-vendedor-form-label'>ID Vendedor</Form.Label>
                                <Form.Control
                                type="number"
                                name="id_vendedor"
                                value={vendavendedorData.id_vendedor}
                                onChange={handleChange}
                                isInvalid={!!errors.id_vendedor}
                                placeholder="Digite o ID do Vendedor"
                                step="1"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.id_vendedor}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                            <Form.Group className="venda-vendedor-form-group" controlId="tipo_participacao">
                                <Form.Label className='venda-vendedor-form-label'>Tipo Participação do Vendedor</Form.Label>
                                <Form.Select
                                className="form-control-custom select-custom"
                                name="tipo_participacao"
                                value={vendavendedorData.tipo_participacao}
                                onChange={handleChange}
                                isInvalid={!!errors.tipo_participacao}
                                required
                                >
                                <option value="">Selecionar Tipo de Participação</option>
                                {getTipoParticipacaoVendaVendedorOptions()}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.tipo_participacao}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="venda-vendedor-form-group" controlId="percentual_comissao">
                                  <Form.Label className='venda-vendedor-form-label'>Percentual Comissão</Form.Label>
                                  <Form.Control
                                    type="text"
                                    value={percentualComissao || '—'}
                                    readOnly
                                  />
                              </Form.Group>
                            </Col>
                        </Row>

                        <div className="button-container">
                            <Button variant="primary" type="submit" disabled={loading}>
                            <FaSave className="me-2" />
                            {loading ? 'Salvando...' : ' Salvar Venda Vendedor'}
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

export default AddVendaVendedor;
