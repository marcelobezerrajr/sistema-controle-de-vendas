import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEntityContext } from '../context/EntityContext';
import MainLayout from '../layouts/MainLayout';
import FieldDisplay from '../components/FieldDisplay';
import '../styles/ViewPage.css';

const ViewPage = () => {
    const { id } = useParams();
    const { entityConfig } = useEntityContext();
    const { entityName, fetchUrl, fields } = entityConfig;
    const [entity, setEntity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEntityData = async () => {
            setLoading(true);
            const url = `${fetchUrl}/${id}`;
            const token = localStorage.getItem('access_token');

            try {
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`${entityName} não encontrado`);
                    } else if (response.status === 403) {
                        throw new Error('Acesso não autorizado');
                    } else {
                        throw new Error('Erro na resposta da rede');
                    }
                }

                const result = await response.json();
                const userData = Array.isArray(result.data) ? result.data[0] : result.data; 
                setEntity(userData || result);

            } catch (error) {
                setError(error.message);
                console.error('Erro na busca:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntityData();
    }, [id, fetchUrl, entityName]);

    const isEntityLoaded = entity && fields.every(field => entity[field.key] !== undefined);

    return (
        <MainLayout>
            <div className="view-entity-container">
                <Card className="view-entity-card">
                    <div className="view-entity-card-header">
                        <h4>Detalhes {entityName}</h4>
                    </div>
                    <Card.Body className="view-entity-card-body">
                        {loading ? (
                            <div className="view-entity-spinner">
                                <Spinner animation="border" />
                                <span>Carregando dados...</span>
                            </div>
                        ) : error ? (
                            <Alert variant="danger" className="view-entity-alert">
                                {error}
                            </Alert>
                        ) : isEntityLoaded ? (
                            <>
                                {fields.map((field) => (
                                    <FieldDisplay
                                        key={field.key}
                                        label={field.label}
                                        value={entity[field.key] || 'N/A'}
                                    />
                                ))}
                            </>
                        ) : (
                            <Alert variant="warning" className="view-entity-alert">
                                {entityName} - Dados ainda não disponíveis.
                            </Alert>
                        )}
                    </Card.Body>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ViewPage;
