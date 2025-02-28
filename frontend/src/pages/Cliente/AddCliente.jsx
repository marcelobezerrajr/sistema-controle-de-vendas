import React, { useState, useRef } from "react";
import { Card, Spinner, Alert, Form, Button, Row, Col } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import useCliente from "../../hooks/useCliente";
import MainLayout from "../../layouts/MainLayout";
import "../../styles/Cliente.css";

const validateName = (value) =>
  value.trim() === "" ? "Nome é obrigatório." : null;
const validateCpfCnpj = (value) => {
  const plainValue = value.replace(/\D/g, "");
  const pattern = /^(\d{11}|\d{14})$/;
  return !pattern.test(plainValue)
    ? "CPF/CNPJ inválido. Use 11 ou 14 dígitos."
    : null;
};

const AddCliente = () => {
  const { addCliente } = useCliente();
  const [clienteData, setClienteData] = useState({
    nome_cliente: "",
    cpf_cnpj: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const cpf_cnpjRef = useRef(null);

  const formatCpfCnpj = (value) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length <= 11) {
      return digitsOnly
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        .substr(0, 14);
    } else {
      return digitsOnly
        .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
        .substr(0, 18);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cpf_cnpj") {
      const formattedValue = formatCpfCnpj(value);
      setClienteData({
        ...clienteData,
        [name]: formattedValue,
      });
    } else {
      setClienteData({
        ...clienteData,
        [name]: value,
      });
    }
    setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(null);

    const nameError = validateName(clienteData.nome_cliente);
    const cpf_cnpjError = validateCpfCnpj(clienteData.cpf_cnpj);
    if (nameError || cpf_cnpjError) {
      setErrors({
        nome_cliente: nameError,
        cpf_cnpj: cpf_cnpjError,
      });
      setLoading(false);
      return;
    }

    try {
      await addCliente(clienteData);
      setSuccess("Cliente adicionado com sucesso!");
      setClienteData({ nome_cliente: "", cpf_cnpj: "" });
    } catch (error) {
      setErrors({ form: "Erro ao adicionar o cliente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="cliente-div">
        <Card className="cliente-card">
          <Card.Header className="cliente-card-header">
            <h4>+ Adicionar Cliente</h4>
          </Card.Header>
          <Card.Body className="cliente-card-body">
            {loading && (
              <div className="cliente-spinner">
                <Spinner animation="border" />
              </div>
            )}
            {errors.form && (
              <Alert variant="danger" className="cliente-alert-error">
                {errors.form}
              </Alert>
            )}
            {success && (
              <Alert variant="success" className="cliente-alert-success">
                {success}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group
                    className="cliente-form-group"
                    controlId="nome_cliente"
                  >
                    <Form.Label className="cliente-form-label">Nome</Form.Label>
                    <Form.Control
                      className="cliente-form-control-custom"
                      type="text"
                      name="nome_cliente"
                      value={clienteData.nome_cliente}
                      onChange={handleChange}
                      isInvalid={!!errors.nome_cliente}
                      placeholder="Digite o Nome"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nome_cliente}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group
                    className="cliente-form-group"
                    controlId="cpf_cnpj"
                  >
                    <Form.Label className="cliente-form-label">
                      CPF/CNPJ
                    </Form.Label>
                    <Form.Control
                      className="cliente-form-cpf-cnpj-custom"
                      type="text"
                      value={clienteData.cpf_cnpj}
                      onChange={handleChange}
                      name="cpf_cnpj"
                      placeholder="Digite o CPF ou CNPJ"
                      isInvalid={!!errors.cpf_cnpj}
                      ref={cpf_cnpjRef}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.cpf_cnpj}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="button-container">
                <Button
                  className="cliente-button-container"
                  variant="primary"
                  type="submit"
                  disabled={loading}
                >
                  <FaSave className="me-2" />
                  {loading ? "Salvando..." : " Salvar Cliente"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AddCliente;
