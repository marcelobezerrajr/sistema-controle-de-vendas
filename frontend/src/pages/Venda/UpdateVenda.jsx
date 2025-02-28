import React, { useState, useEffect } from "react";
import {
  Card,
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import useVenda from "../../hooks/useVenda";
import useCliente from "../../hooks/useCliente";
import useFornecedor from "../../hooks/useFornecedor";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Venda.css";

const UpdateVenda = () => {
  const { id_venda } = useParams();
  const { getVenda, updateVendaData } = useVenda();
  const { getCliente } = useCliente();
  const { getFornecedor } = useFornecedor();
  const [vendaData, setVendaData] = useState({
    tipo_venda: "",
    tipo_faturamento: "",
    valor_total: "",
    moeda: "",
    valor_convertido: "",
    id_cliente: "",
    id_fornecedor: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!id_venda) {
      setErrors({ form: "ID de venda não definido." });
      return;
    }

    const fetchVenda = async () => {
      setLoading(true);
      try {
        const data = await getVenda(id_venda);
        setVendaData(data);
      } catch (error) {
        setErrors({ form: "Erro ao carregar os dados da venda." });
      } finally {
        setLoading(false);
      }
    };
    fetchVenda();
  }, [id_venda, getVenda]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendaData({
      ...vendaData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!vendaData.tipo_venda)
      newErrors.tipo_venda = "Tipo de venda é obrigatório";
    if (!vendaData.tipo_faturamento)
      newErrors.tipo_faturamento = "Tipo de faturamento é obrigatório";
    if (!vendaData.valor_total || vendaData.valor_total <= 0)
      newErrors.valor_total = "Valor total inválido";
    if (!vendaData.moeda) newErrors.moeda = "Moeda é obrigatória";
    if (!vendaData.id_cliente)
      newErrors.id_cliente = "ID do Cliente é obrigatório";
    if (!vendaData.id_fornecedor)
      newErrors.id_fornecedor = "ID do Fornecedor é obrigatório";

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

    let validationErrorExists = false;

    try {
      await getCliente(vendaData.id_cliente);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id_cliente: "ID do Cliente inválido ou não encontrado.",
      }));
      validationErrorExists = true;
    }

    try {
      await getFornecedor(vendaData.id_fornecedor);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id_fornecedor: "ID do Fornecedor inválido ou não encontrado.",
      }));
      validationErrorExists = true;
    }

    if (validationErrorExists) {
      setLoading(false);
      return;
    }

    try {
      await updateVendaData(id_venda, vendaData);
      setSuccess("Venda atualizada com sucesso!");
    } catch (error) {
      setErrors({ form: "Erro ao atualizar a venda." });
    } finally {
      setLoading(false);
    }
  };

  const getTipoVendaOptions = () => (
    <>
      <option value="Transacional">Transacional</option>
      <option value="Recorrente">Recorrente</option>
    </>
  );

  const getTipoFaturamentoOptions = () => (
    <>
      <option value="Empresa">Empresa</option>
      <option value="Fornecedor">Fornecedor</option>
    </>
  );

  const getMoedaOptions = () => (
    <>
      <option value="BRL">BRL</option>
      <option value="USD">USD</option>
    </>
  );

  return (
    <MainLayout>
      <div className="venda-div">
        <Container className="venda-container">
          <Row className="justify-content-md-center">
            <Col md={12} lg={10}>
              <Card className="venda-card">
                <Card.Header className="venda-card-header">
                  <h4>Atualizar Venda</h4>
                </Card.Header>
                <Card.Body className="venda-card-body">
                  {loading && (
                    <div className="venda-spinner">
                      <Spinner animation="border" />
                    </div>
                  )}
                  {errors.form && (
                    <Alert variant="danger" className="venda-alert-error">
                      {errors.form}
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="success" className="venda-alert-success">
                      {success}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="venda-form-group"
                          controlId="tipo_venda"
                        >
                          <Form.Label className="venda-form-label">
                            Tipo Venda
                          </Form.Label>
                          <Form.Select
                            className="venda-form-select-custom"
                            name="tipo_venda"
                            value={vendaData.tipo_venda}
                            onChange={handleChange}
                            isInvalid={!!errors.tipo_venda}
                            required
                          >
                            <option value="">Selecionar Tipo Venda</option>
                            {getTipoVendaOptions()}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.tipo_venda}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-form-group"
                          controlId="tipo_faturamento"
                        >
                          <Form.Label className="venda-form-label">
                            Tipo Faturamento
                          </Form.Label>
                          <Form.Select
                            className="venda-form-select-custom"
                            name="tipo_faturamento"
                            value={vendaData.tipo_faturamento}
                            onChange={handleChange}
                            isInvalid={!!errors.tipo_faturamento}
                            required
                          >
                            <option value="">
                              Selecionar Tipo Faturamento
                            </option>
                            {getTipoFaturamentoOptions()}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.tipo_faturamento}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-form-group"
                          controlId="moeda"
                        >
                          <Form.Label className="venda-form-label">
                            Moeda
                          </Form.Label>
                          <Form.Select
                            className="venda-form-select-custom"
                            name="moeda"
                            value={vendaData.moeda}
                            onChange={handleChange}
                            isInvalid={!!errors.moeda}
                            required
                          >
                            <option value="">Selecionar Moeda</option>
                            {getMoedaOptions()}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.moeda}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-form-group"
                          controlId="valor_total"
                        >
                          <Form.Label className="venda-form-label">
                            Valor Total
                          </Form.Label>
                          <Form.Control
                            className="venda-form-control-custom"
                            type="number"
                            name="valor_total"
                            value={vendaData.valor_total}
                            onChange={handleChange}
                            isInvalid={!!errors.valor_total}
                            placeholder="Digite o Valor Total"
                            step="0.01"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.valor_total}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-form-group"
                          controlId="valor_convertido"
                        >
                          <Form.Label className="venda-form-label">
                            Valor Convertido
                          </Form.Label>
                          <Form.Control
                            className="venda-form-control-custom"
                            type="number"
                            name="valor_convertido"
                            value={vendaData.valor_convertido}
                            onChange={handleChange}
                            isInvalid={!!errors.valor_convertido}
                            placeholder="Digite o Valor Convertido"
                            step="0.01"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.valor_convertido}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-form-group"
                          controlId="id_cliente"
                        >
                          <Form.Label className="venda-form-label">
                            ID Cliente
                          </Form.Label>
                          <Form.Control
                            className="venda-form-control-custom"
                            type="number"
                            name="id_cliente"
                            value={vendaData.id_cliente}
                            onChange={handleChange}
                            isInvalid={!!errors.id_cliente}
                            placeholder="Digite o ID do Cliente"
                            step="1"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.id_cliente}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-form-group"
                          controlId="id_fornecedor"
                        >
                          <Form.Label className="venda-form-label">
                            ID Fornecedor
                          </Form.Label>
                          <Form.Control
                            className="venda-form-control-custom"
                            type="number"
                            name="id_fornecedor"
                            value={vendaData.id_fornecedor}
                            onChange={handleChange}
                            isInvalid={!!errors.id_fornecedor}
                            placeholder="Digite o ID do Fornecedor"
                            step="1"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.id_fornecedor}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="button-container">
                      <Button
                        className="venda-button-container"
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        <FaSave className="me-2" />
                        {loading ? "Salvando..." : " Salvar Venda"}
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

export default UpdateVenda;
