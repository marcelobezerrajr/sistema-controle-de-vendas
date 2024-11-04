import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import FieldDisplay from '../../components/FieldDisplay';
import useVendaVendedor from '../../hooks/useVendaVendedor';
import '../../styles/ViewPage.css';

const ViewVendaVendedorPage = () => {
    const { id_venda, id_vendedor } = useParams();
    const { getVendaVendedor } = useVendaVendedor();
    const [entity, setEntity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getEntityConfig = (entityType) => {
        let config;
        switch (entityType) {
            case 'venda-vendedor':
                config = {
                    entityName: 'Venda Vendedor',
                    fetchUrl: 'http://localhost/venda-vendedor/view',
                    fields: [
                        { label: 'ID Venda', key: 'id_venda' },
                        { label: 'ID Vendedor', key: 'id_vendedor' },
                        { label: 'Tipo de Participação', key: 'tipo_participacao' },
                        { label: 'Percentual de Comissão', key: 'percentual_comissao' },
                    ],
                };
                break;
            default:
                config = {
                    entityName: 'Entidade',
                    fetchUrl: '',
                    fields: [],
                };
        }
        return config;
    };

    const entityConfig = getEntityConfig('venda-vendedor');

    useEffect(() => {
        const fetchEntityData = async () => {
            setLoading(true);
            try {
                const data = await getVendaVendedor(id_venda, id_vendedor);
                setEntity(data);
            } catch (error) {
                setError(error.message || "Erro ao carregar os dados de Venda e Vendedor.");
                console.error('Erro de busca:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntityData();
    }, [id_venda, id_vendedor, getVendaVendedor]);

    return (
        <MainLayout>
            <div className="view-entity-container">
                <Card className="view-entity-card">
                    <div className="view-entity-card-header">
                        <h4>Detalhes {entityConfig.entityName}</h4>
                    </div>
                    <Card.Body className="view-entity-card-body">
                        {loading && (
                            <div className="view-entity-spinner">
                                <Spinner animation="border" />
                            </div>
                        )}
                        {error && (
                            <Alert variant="danger" className="view-entity-alert">
                                {error}
                            </Alert>
                        )}
                        {entity ? (
                            <>
                                {entityConfig.fields.map((field) => (
                                    <FieldDisplay
                                        key={field.key}
                                        label={field.label}
                                        value={entity[field.key] || 'N/A'}
                                    />
                                ))}
                            </>
                        ) : (
                            !loading && (
                                <Alert variant="warning" className="view-entity-alert">
                                    {entityConfig.entityName} - Não tem dados disponíveis
                                </Alert>
                            )
                        )}
                    </Card.Body>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ViewVendaVendedorPage;
