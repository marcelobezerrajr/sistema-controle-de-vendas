import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import useComissao from '../../hooks/useComissao';
import useVendedor from '../../hooks/useVendedor';
import useParcela from '../../hooks/useParcela';
import MainLayout from '../../layouts/MainLayout';
import "../../styles/Comissao.css";

const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date + "T00:00:00");
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}/${month}/${day}`;
};

const AddComissao = () => {
  const { addComissao, calcularComissao } = useComissao();
  const [comissaoData, setComissaoData] = useState({
    id_vendedor: '', 
    id_parcela: '', 
    data_pagamento: '', 
    valor_comissao: '',
    percentual_comissao: ''
  });
  const { getVendedor } = useVendedor();
  const { getParcela } = useParcela();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setComissaoData({
      ...comissaoData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const fetchComissaoCalculada = async () => {
    try {
      let validationErrorExists = false;

      try {
        await getVendedor(comissaoData.id_vendedor);
      } catch (error) {
        setErrors((prevErrors) => ({ ...prevErrors, id_vendedor: 'ID do Vendedor inválido ou não encontrado.' }));
        validationErrorExists = true;
      }

      try {
        await getParcela(comissaoData.id_parcela);
      } catch (error) {
        setErrors((prevErrors) => ({ ...prevErrors, id_parcela: 'ID da Parcela inválido ou não encontrado.' }));
        validationErrorExists = true;
      }
    
      if (validationErrorExists) {
        setLoading(false);
        return;
      }
      const data = await calcularComissao(comissaoData.id_vendedor, comissaoData.id_parcela);
      setComissaoData((prevData) => ({
        ...prevData,
        valor_comissao: data.valor_comissao,
        percentual_comissao: data.percentual_comissao,
      }));
    } catch (error) {
      console.error("Erro ao calcular comissão:", error);
      setErrors((prevErrors) => ({ ...prevErrors, form: 'Erro ao calcular a comissão.' }));
    }
  };

  useEffect(() => {
    if (comissaoData.id_vendedor && comissaoData.id_parcela) {
      fetchComissaoCalculada();
    }
  }, [comissaoData.id_vendedor, comissaoData.id_parcela]);

  const validateForm = () => {
    const validationErrors = {};
    if (!comissaoData.id_vendedor) validationErrors.id_vendedor = 'ID do Vendedor é obrigatório';
    if (!comissaoData.id_parcela) validationErrors.id_parcela = 'ID da Parcela é obrigatório';
    if (!comissaoData.data_pagamento) validationErrors.data_pagamento = 'Data de pagamento é obrigatória';
    return validationErrors;
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

    const formattedData = {
      ...comissaoData,
      data_pagamento: formatDate(comissaoData.data_pagamento)
    };

    try {
      await addComissao(formattedData);
      setSuccess('Comissão adicionada com sucesso!');
      setComissaoData({ id_vendedor: '', id_parcela: '', data_pagamento: '', valor_comissao: '', percentual_comissao: '' });
    } catch (error) {
      setErrors({ form: error.message || 'Erro ao adicionar a comissão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="comissao-div">
        <Container className='comissao-container'>
          <Row className='justify-content-md-center'>
            <Col md={12} lg={10}>
              <Card className="comissao-card">
                <Card.Header className="comissao-card-header">
                  <h4>+ Adicionar Comissão</h4>
                </Card.Header>
                <Card.Body className="comissao-card-body">
                  {loading && (
                    <div className="comissao-spinner">
                      <Spinner animation="border" />
                    </div>
                  )}
                  {errors.form && (
                    <Alert variant="danger" className="comissao-alert-error">
                      {errors.form}
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="success" className="comissao-alert-success">
                      {success}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="comissao-form-group" controlId="id_vendedor">
                          <Form.Label className='comissao-form-label'>ID do Vendedor</Form.Label>
                          <Form.Control
                            className="comissao-form-control-custom"
                            type="number"
                            name="id_vendedor"
                            value={comissaoData.id_vendedor}
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
                        <Form.Group className="comissao-form-group" controlId="id_parcela">
                          <Form.Label className='comissao-form-label'>ID da Parcela</Form.Label>
                          <Form.Control
                            className="comissao-form-control-custom"
                            type="number"
                            name="id_parcela"
                            value={comissaoData.id_parcela}
                            onChange={handleChange}
                            isInvalid={!!errors.id_parcela}
                            placeholder="Digite o ID da Parcela"
                            step="1"
                            required
                          />
                          <Form.Control.Feedback type="invalid">{errors.id_parcela}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="comissao-form-group" controlId="valor_comissao">
                          <Form.Label className='comissao-form-label'>Valor da Comissão</Form.Label>
                          <Form.Control
                            className="comissao-form-control-custom"
                            type="number"
                            name="valor_comissao"
                            value={comissaoData.valor_comissao}
                            placeholder="Valor da Comissão"
                            readOnly
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="comissao-form-group" controlId="percentual_comissao">
                          <Form.Label className='comissao-form-label'>Percentual de Comissão</Form.Label>
                          <Form.Control
                            className="comissao-form-control-custom"
                            type="number"
                            name="percentual_comissao"
                            value={comissaoData.percentual_comissao}
                            placeholder="Percentual de Comissão"
                            readOnly
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="comissao-form-group" controlId="data_pagamento">
                          <Form.Label className='comissao-form-label'>Data de Pagamento</Form.Label>
                          <Form.Control
                            className="comissao-form-control-custom"
                            type="date"
                            name="data_pagamento"
                            value={comissaoData.data_pagamento}
                            onChange={handleChange}
                            isInvalid={!!errors.data_pagamento}
                            required
                          />
                          <Form.Control.Feedback type="invalid">{errors.data_pagamento}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="button-container">
                      <Button className="comissao-button-container" variant="primary" type="submit" disabled={loading}>
                        <FaSave className="me-2" />
                        {loading ? 'Salvando...' : ' Salvar Comissão'}
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

export default AddComissao;
