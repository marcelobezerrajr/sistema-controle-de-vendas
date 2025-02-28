import React, { useState } from "react";
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
import useVendaVendedor from "../../hooks/useVendaVendedor";
import useVendedor from "../../hooks/useVendedor";
import useVenda from "../../hooks/useVenda";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/VendaVendedor.css";

const AddVendaVendedor = () => {
  const { addVendaVendedor } = useVendaVendedor();
  const { getVendedor } = useVendedor();
  const { getVenda } = useVenda();
  const [vendavendedorData, setVendaVendedorData] = useState({
    id_venda: "",
    id_vendedor: "",
    tipo_participacao: "",
    percentual_comissao: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleVendedorChange = async (e) => {
    const idVendedor = e.target.value;
    setVendaVendedorData({
      ...vendavendedorData,
      id_vendedor: idVendedor,
    });
    setErrors({ ...errors, id_vendedor: null });

    if (idVendedor) {
      try {
        const vendedor = await getVendedor(idVendedor);
        setVendaVendedorData((prev) => ({
          ...prev,
          tipo_participacao: vendedor.tipo,
          percentual_comissao: vendedor.percentual_comissao,
        }));
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          id_vendedor: "ID do Vendedor inválido ou não encontrado.",
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendaVendedorData({
      ...vendavendedorData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!vendavendedorData.id_venda)
      newErrors.id_venda = "ID da Venda é obrigatório";
    if (!vendavendedorData.id_vendedor)
      newErrors.id_vendedor = "ID do Vendedor é obrigatório";
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
      await getVenda(vendavendedorData.id_venda);
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id_venda: "ID da Venda inválido ou não encontrado.",
      }));
      validationErrorExists = true;
    }

    if (validationErrorExists) {
      setLoading(false);
      return;
    }

    try {
      await addVendaVendedor(vendavendedorData);
      setSuccess("Venda Vendedor adicionada com sucesso!");
      setVendaVendedorData({
        id_venda: "",
        id_vendedor: "",
        tipo_participacao: "",
        percentual_comissao: "",
      });
    } catch (error) {
      const errorMessage = error.response?.data?.detail;
      if (errorMessage && errorMessage === "Venda Vendedor já existe") {
        setErrors({ form: "Venda Vendedor já existe." });
      } else {
        setErrors({
          form: "Erro ao adicionar a venda vendedor. Tente novamente.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="venda-vendedor-div">
        <Container className="venda-vendedor-container">
          <Row className="justify-content-md-center">
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
                    <Alert
                      variant="danger"
                      className="venda-vendedor-alert-error"
                    >
                      {errors.form}
                    </Alert>
                  )}
                  {success && (
                    <Alert
                      variant="success"
                      className="venda-vendedor-alert-success"
                    >
                      {success}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="venda-vendedor-form-group"
                          controlId="id_venda"
                        >
                          <Form.Label className="venda-vendedor-form-label">
                            ID da Venda
                          </Form.Label>
                          <Form.Control
                            className="venda-vendedor-form-control-custom"
                            type="number"
                            name="id_venda"
                            value={vendavendedorData.id_venda}
                            onChange={handleChange}
                            isInvalid={!!errors.id_venda}
                            placeholder="Digite o ID da Venda"
                            step="1"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.id_venda}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-vendedor-form-group"
                          controlId="id_vendedor"
                        >
                          <Form.Label className="venda-vendedor-form-label">
                            ID do Vendedor
                          </Form.Label>
                          <Form.Control
                            className="venda-vendedor-form-control-custom"
                            type="number"
                            name="id_vendedor"
                            value={vendavendedorData.id_vendedor}
                            onChange={handleVendedorChange}
                            isInvalid={!!errors.id_vendedor}
                            placeholder="Digite o ID do Vendedor"
                            step="1"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.id_vendedor}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-vendedor-form-group"
                          controlId="tipo_participacao"
                        >
                          <Form.Label className="venda-vendedor-form-label">
                            Tipo Participação do Vendedor
                          </Form.Label>
                          <Form.Control
                            className="venda-vendedor-form-control-custom"
                            type="text"
                            name="tipo_participacao"
                            value={vendavendedorData.tipo_participacao}
                            onChange={handleChange}
                            isInvalid={!!errors.tipo_participacao}
                            placeholder="Tipo Participação"
                            required
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.tipo_participacao}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="venda-vendedor-form-group"
                          controlId="percentual_comissao"
                        >
                          <Form.Label className="venda-vendedor-form-label">
                            Percentual Comissão
                          </Form.Label>
                          <Form.Control
                            className="venda-vendedor-form-control-custom"
                            type="number"
                            name="percentual_comissao"
                            value={vendavendedorData.percentual_comissao}
                            onChange={handleChange}
                            isInvalid={!!errors.percentual_comissao}
                            placeholder="Percentual Comissão"
                            required
                            readOnly
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.percentual_comissao}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="button-container">
                      <Button
                        className="venda-vendedor-button-container"
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        <FaSave className="me-2" />
                        {loading ? "Salvando..." : " Salvar Venda Vendedor"}
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
