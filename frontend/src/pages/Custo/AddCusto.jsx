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
import useCusto from "../../hooks/useCusto";
import useVendas from "../../hooks/useVenda";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Custo.css";

const AddCusto = () => {
  const { addCusto } = useCusto();
  const { getVenda } = useVendas();
  const [custoData, setCustoData] = useState({
    descricao: "",
    valor: "",
    id_venda: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustoData({
      ...custoData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!custoData.descricao) newErrors.descricao = "Descrição é obrigatório";
    if (!custoData.valor || custoData.valor <= 0)
      newErrors.valor = "Valor inválido";
    if (!custoData.id_venda) newErrors.id_venda = "Id de Venda é obrigatório";

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
      await getVenda(custoData.id_venda);
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
      await addCusto({
        ...custoData,
      });
      setSuccess("Custo adicionado com sucesso!");
      setCustoData({ descricao: "", valor: "", id_venda: "" });
    } catch (error) {
      setErrors({
        form: error.message || "Erro ao adicionar o custo. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="custo-div">
        <Container className="custo-container">
          <Row className="justify-content-md-center">
            <Col md={12} lg={10}>
              <Card className="custo-card">
                <Card.Header className="custo-card-header">
                  <h4>+ Adicionar Custo</h4>
                </Card.Header>
                <Card.Body className="custo-card-body">
                  {loading && (
                    <div className="custo-spinner">
                      <Spinner animation="border" />
                    </div>
                  )}
                  {errors.form && (
                    <Alert variant="danger" className="custo-alert-error">
                      {errors.form}
                    </Alert>
                  )}
                  {success && (
                    <Alert variant="success" className="custo-alert-success">
                      {success}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <Form.Group
                          className="custo-form-group"
                          controlId="descricao"
                        >
                          <Form.Label className="custo-form-label">
                            Descrição do Custo
                          </Form.Label>
                          <Form.Control
                            className="custo-form-control-descricao-custom"
                            type="text"
                            name="descricao"
                            value={custoData.descricao}
                            onChange={handleChange}
                            isInvalid={!!errors.descricao}
                            placeholder="Digite a Descrição do Custo"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.descricao}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="custo-form-group"
                          controlId="valor"
                        >
                          <Form.Label className="custo-form-label">
                            Valor
                          </Form.Label>
                          <Form.Control
                            className="custo-form-control-custom"
                            type="number"
                            name="valor"
                            value={custoData.valor}
                            onChange={handleChange}
                            isInvalid={!!errors.valor}
                            placeholder="Digite o Valor do Custo"
                            step="0.01"
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.valor}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group
                          className="custo-form-group"
                          controlId="id_venda"
                        >
                          <Form.Label className="custo-form-label">
                            ID da Venda
                          </Form.Label>
                          <Form.Control
                            className="custo-form-control-custom"
                            type="number"
                            name="id_venda"
                            value={custoData.id_venda}
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
                    </Row>
                    <div className="button-container">
                      <Button
                        className="custo-button-container"
                        variant="primary"
                        type="submit"
                        disabled={loading}
                      >
                        <FaSave className="me-2" />
                        {loading ? "Salvando..." : " Salvar Custo"}
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

export default AddCusto;
