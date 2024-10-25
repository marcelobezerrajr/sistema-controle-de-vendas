import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Form, Button, Row, Col, Container } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import useProdutos from '../../hooks/useProduto';
import MainLayout from '../../layouts/MainLayout';
import "../../styles/Produto.css";

const UpdateProduto = () => {
  const { id_produto } = useParams();
  const { getProduto, updateProdutoData } = useProdutos();
  const [produtoData, setProdutoData] = useState({ nome_produto: '', descricao_produto: '', preco: '', tipo: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!id_produto) {
      setErrors({ form: 'ID do produto não definido.' });
      return;
    }

    const fetchProduto = async () => {
      setLoading(true);
      try {
        const data = await getProduto(id_produto);
        setProdutoData({
          ...data,
          preco: data.preco.toString(),
        });
      } catch (error) {
        setErrors({ form: 'Erro ao carregar os dados do Produto.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProduto();
  }, [id_produto, getProduto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProdutoData({
      ...produtoData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!produtoData.nome_produto) newErrors.nome_produto = "Nome do Produto é obrigatório";
    if (!produtoData.descricao_produto) newErrors.descricao_produto = "Descrição do Produto é obrigatório";
    if (!produtoData.preco || produtoData.preco <= 0) newErrors.preco = "Preço total inválido";
    if (!produtoData.tipo) newErrors.tipo = "Tipo de Produto é obrigatório";

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
      const updatedData = {
        ...produtoData,
        preco: parseFloat(produtoData.preco),
      };

      await updateProdutoData(id_produto, updatedData);
      setSuccess('Produto atualizado com sucesso!');
    } catch (error) {
      setErrors({ form: 'Erro ao atualizar o produto. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const getTipoProdutoOptions = () => (
    <>
      <option value="Produto">Produto</option>
      <option value="Serviço">Serviço</option>
    </>
  );

  return (
    <MainLayout>
      <div className="produto-div">
        <Container className='produto-container'>
            <Row className='justify-content-md-center'>
                <Col md={12} lg={10}>
                    <Card className="produto-card">
                    <Card.Header className="produto-card-header">
                        <h4>Atualizar Produto</h4>
                    </Card.Header>
                    <Card.Body className="produto-card-body">
                        {loading && (
                        <div className="produto-spinner">
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
                            <Form.Group className="produto-form-group" controlId="nome_produto">
                                <Form.Label className="produto-form-label">Nome</Form.Label>
                                <Form.Control
                                className="produto-form-control-custom"
                                type="text"
                                name="nome_produto"
                                value={produtoData.nome_produto}
                                onChange={handleChange}
                                isInvalid={!!errors.nome_produto}
                                placeholder="Digite o Nome do Produto"
                                />
                                <Form.Control.Feedback type="invalid">{errors.nome_produto}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="produto-form-group" controlId="descricao_produto">
                                <Form.Label className="produto-form-label">Descrição Produto</Form.Label>
                                <Form.Control
                                className="produto-form-control-custom"
                                type="text"
                                name="descricao_produto"
                                value={produtoData.descricao_produto}
                                onChange={handleChange}
                                isInvalid={!!errors.descricao_produto}
                                placeholder="Digite a Descrição do Produto"
                                />
                                <Form.Control.Feedback type="invalid">{errors.descricao_produto}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="produto-form-group" controlId="preco">
                                <Form.Label className='produto-form-label'>Preço</Form.Label>
                                <Form.Control
                                className="produto-form-select-custom"
                                type="number"
                                name="preco"
                                value={produtoData.preco}
                                onChange={handleChange}
                                isInvalid={!!errors.preco}
                                placeholder="Digite o Preço do Produto"
                                step="0.01"
                                required
                                />
                                <Form.Control.Feedback type="invalid">{errors.preco}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>

                            <Col md={6}>
                            <Form.Group className="produto-form-group" controlId="tipo">
                                <Form.Label className='produto-form-label'>Tipo de Produto</Form.Label>
                                <Form.Select
                                className="produto-form-select-custom"
                                name="tipo"
                                value={produtoData.tipo}
                                onChange={handleChange}
                                isInvalid={!!errors.tipo}
                                required
                                >
                                <option value="">Selecionar Tipo do Produto</option>
                                {getTipoProdutoOptions()}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">{errors.tipo}</Form.Control.Feedback>
                            </Form.Group>
                            </Col>
                        </Row>
                        <div className="button-container">
                            <Button className="produto-button-container" variant="primary" type="submit" disabled={loading}>
                            <FaSave className="me-2" />
                            {loading ? 'Salvando...' : ' Salvar Produto'}
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

export default UpdateProduto;
