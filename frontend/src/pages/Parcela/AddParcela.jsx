import React, { useState } from 'react';
import { Card, Spinner, Alert, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import useParcelas from '../../hooks/useParcela';
import MainLayout from '../../layouts/MainLayout';
import "../../styles/Parcela.css"

const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}/${month}/${day}`;
  };

  const AddParcela = () => {
    const { addParcela } = useParcelas();
    const [parcelaData, setParcelaData] = useState({
      id_venda: '', 
      numero_parcela: '', 
      valor_parcela: '', 
      data_prevista: '', 
      data_recebimento: '', 
      status: '', 
      forma_recebimento: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setParcelaData({
        ...parcelaData,
        [name]: value,
      });
      setErrors({ ...errors, [name]: null });
    };
  
    const validateForm = () => {
      const newErrors = {};
      if (!parcelaData.id_venda) newErrors.id_venda = "ID de Venda é obrigatório";
      if (!parcelaData.numero_parcela) newErrors.numero_parcela = "Número da quantidade de Parcelas é obrigatório";
      if (!parcelaData.valor_parcela || parcelaData.valor_parcela <= 0) newErrors.valor_parcela = "Valor da Parcela inválido";
      if (!parcelaData.data_prevista) newErrors.data_prevista = "Data Prevista é obrigatória";
      if (!parcelaData.status) newErrors.status = "Status da Parcela é obrigatório";
      if (!parcelaData.forma_recebimento) newErrors.forma_recebimento = "Forma de Recebimento da Parcela é obrigatório";
      
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
  
      const formattedData = {
        ...parcelaData,
        data_prevista: formatDate(parcelaData.data_prevista),
        data_recebimento: parcelaData.data_recebimento ? formatDate(parcelaData.data_recebimento) : null
      };
  
      try {
        await addParcela(formattedData);
        setSuccess('Parcela adicionada com sucesso!');
        setParcelaData({
          id_venda: '', 
          numero_parcela: '', 
          valor_parcela: '', 
          data_prevista: '', 
          data_recebimento: '', 
          status: '', 
          forma_recebimento: ''
        });
      } catch (error) {
        setErrors({ form: 'Erro ao adicionar a parcela. Tente novamente.' });
      } finally {
        setLoading(false);
      }
    };
  
    const getStatusParcelaOptions = () => (
      <>
        <option value="Pendente">Pendente</option>
        <option value="Pago">Pago</option>
        <option value="Atrasado">Atrasado</option>
      </>
    );
  
    const getFormaRecebimentoOptions = () => (
      <>
        <option value="Primeira">Primeira</option>
        <option value="Subsequente">Subsequente</option>
      </>
    );

  return (
    <MainLayout>
      <div className="parcela-div">
        <Container className='parcela-container'>
            <Row className='justify-content-md-center'>
                <Col md={12} lg={10}>
                    <Card className="parcela-card">
                    <Card.Header className="parcela-card-header">
                        <h4>+ Adicionar Parcela</h4>
                    </Card.Header>
                    <Card.Body className="parcela-card-body">
                        {loading && (
                        <div className="parcela-spinner">
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
                            <Form.Group className="parcela-form-group" controlId="id_venda">
                                <Form.Label className='parcela-form-label'>ID Venda</Form.Label>
                                <Form.Control
                                type="number"
                                name="id_venda"
                                value={parcelaData.id_venda}
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
                            <Form.Group className="parcela-form-group" controlId="numero_parcela">
                                <Form.Label className='parcela-form-label'>Número da Parcela</Form.Label>
                                <Form.Control
                                type="number"
                                name="numero_parcela"
                                value={parcelaData.numero_parcela}
                                onChange={handleChange}
                                isInvalid={!!errors.numero_parcela}
                                placeholder="Digite o Número da Parcela"
                                step="1"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.numero_parcela}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                            
                            <Col md={6}>
                            <Form.Group className="parcela-form-group" controlId="valor_parcela">
                                <Form.Label className='parcela-form-label'>Valor da Parcela</Form.Label>
                                <Form.Control
                                type="number"
                                name="valor_parcela"
                                value={parcelaData.valor_parcela}
                                onChange={handleChange}
                                isInvalid={!!errors.valor_parcela}
                                placeholder="Digite o Valor da Parcela"
                                step="0.01"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.valor_parcela}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="parcela-form-group" controlId="status">
                                <Form.Label className='parcela-form-label'>Status Parcela</Form.Label>
                                <Form.Select
                                className="form-control-custom select-custom"
                                name="status"
                                value={parcelaData.status}
                                onChange={handleChange}
                                isInvalid={!!errors.status}
                                required
                                >
                                <option value="">Selecionar Status Parcela</option>
                                {getStatusParcelaOptions()}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.status}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="parcela-form-group" controlId="forma_recebimento">
                                <Form.Label className='parcela-form-label'>Forma Recebimento</Form.Label>
                                <Form.Select
                                className="form-control-custom select-custom"
                                name="forma_recebimento"
                                value={parcelaData.forma_recebimento}
                                onChange={handleChange}
                                isInvalid={!!errors.forma_recebimento}
                                required
                                >
                                <option value="">Selecionar Forma Recebimento</option>
                                {getFormaRecebimentoOptions()}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.forma_recebimento}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="parcela-form-group" controlId="data_prevista">
                                <Form.Label className='parcela-form-label'>Data Prevista</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="data_prevista"
                                  value={parcelaData.data_prevista}
                                  onChange={handleChange}
                                  isInvalid={!!errors.data_prevista}
                                  required
                                />
                                <Form.Control.Feedback type="invalid">{errors.data_prevista}</Form.Control.Feedback>
                              </Form.Group>
                            </Col>

                            <Col md={6}>
                              <Form.Group className="parcela-form-group" controlId="data_recebimento">
                                <Form.Label className='parcela-form-label'>Data de Recebimento</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="data_recebimento"
                                  value={parcelaData.data_recebimento}
                                  onChange={handleChange}
                                  isInvalid={!!errors.data_recebimento}
                                />
                                <Form.Control.Feedback type="invalid">{errors.data_recebimento}</Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                        </Row>

                        <div className="button-container">
                            <Button variant="primary" type="submit" disabled={loading}>
                            <FaSave className="me-2" />
                            {loading ? 'Salvando...' : ' Salvar Parcela'}
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

export default AddParcela;
