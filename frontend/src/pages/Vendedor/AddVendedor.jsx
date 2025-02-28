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
import useVendedor from "../../hooks/useVendedor";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Vendedor.css";

const AddVendedor = () => {
  const { addVendedor } = useVendedor();
  const [vendedorData, setVendedorData] = useState({
    nome_vendedor: "",
    tipo: "",
    percentual_comissao: "",
  });
  const [percentualComissao, setPercentualComissao] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const calcularComissao = (tipo) => {
    if (tipo === "Inside Sales") {
      return 7.5;
    } else if (tipo === "Account Executive") {
      return 5.0;
    } else {
      return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendedorData({
      ...vendedorData,
      [name]: value,
    });

    if (name === "tipo") {
      const comissao = calcularComissao(value);
      setPercentualComissao(comissao);
    }

    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!vendedorData.nome_vendedor)
      newErrors.nome_vendedor = "Nome do Vendedor é obrigatório";
    if (!vendedorData.tipo) newErrors.tipo = "Tipo de vendedor é obrigatório";

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
      await addVendedor({
        ...vendedorData,
        percentual_comissao: percentualComissao,
      });
      setSuccess("Vendedor adicionado com sucesso!");
      setVendedorData({
        nome_vendedor: "",
        tipo: "",
        percentual_comissao: "",
      });
      setPercentualComissao("");
    } catch (error) {
      setErrors({ form: "Erro ao adicionar o vendedor. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const getTipoVendedorOptions = () => (
    <>
      <option value="Inside Sales">Inside Sales</option>
      <option value="Account Executive">Account Executive</option>
    </>
  );

  return (
    <MainLayout>
      <div className="vendedor-div">
        <Container className="vendedor-container">
          <Row className="justify-content-md-center">
            <Col md={12} lg={10}>
              <Card className="vendedor-card">
                <Card.Header className="vendedor-card-header">
                  <h4>+ Adicionar Vendedor</h4>
                </Card.Header>
                <Card.Body className="vendedor-card-body">
                  {loading && (
                    <div className="vendedor-spinner">
                      <Spinner animation="border" />
                    </div>
                  )}
                  {errors.form && (
                    <Alert variant="danger" className="vendedor-alert-error">
                      {errors.form}
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="success" className="vendedor-alert-success">
                      {success}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="vendedor-form-group"
                          controlId="nome_vendedor"
                        >
                          <Form.Label className="vendedor-form-label">
                            Nome
                          </Form.Label>
                          <Form.Control
                            className="vendedor-form-control-custom"
                            type="text"
                            name="nome_vendedor"
                            value={vendedorData.nome_vendedor}
                            onChange={handleChange}
                            isInvalid={!!errors.nome_vendedor}
                            placeholder="Digite o Nome"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.nome_vendedor}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="vendedor-form-group"
                          controlId="tipo"
                        >
                          <Form.Label className="vendedor-form-label">
                            Tipo Vendedor
                          </Form.Label>
                          <Form.Select
                            className="vendedor-form-select-custom"
                            name="tipo"
                            value={vendedorData.tipo}
                            onChange={handleChange}
                            isInvalid={!!errors.tipo}
                            required
                          >
                            <option value="">Selecionar Tipo Vendedor</option>
                            {getTipoVendedorOptions()}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.tipo}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="vendedor-form-group"
                          controlId="percentual_comissao"
                        >
                          <Form.Label className="vendedor-form-label">
                            Percentual Comissão
                          </Form.Label>
                          <Form.Control
                            className="vendedor-form-select-custom"
                            type="text"
                            value={percentualComissao || "—"}
                            readOnly
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <div className="button-container">
                      <Button
                        className="vendedor-button-container"
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        <FaSave className="me-2" />
                        {loading ? "Salvando..." : " Salvar Vendedor"}
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

export default AddVendedor;
