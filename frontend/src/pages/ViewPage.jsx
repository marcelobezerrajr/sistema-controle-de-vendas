import React, { useEffect, useState } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEntityContext } from '../context/EntityContext';
import MainLayout from '../layouts/MainLayout';
import FieldDisplay from '../components/FieldDisplay';
import '../styles/ViewPage.css';

const ViewPage = () => {
    const { id, id_venda, id_vendedor } = useParams();
    const { entityConfig } = useEntityContext();
    const { entityName, fetchUrl, fields } = entityConfig;
    const [entity, setEntity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEntityData = async () => {
            const url = id_venda && id_vendedor
                ? `${fetchUrl}/${id_venda}/${id_vendedor}`
                : `${fetchUrl}/${id}`;
                
            const token = localStorage.getItem('access_token');

            try {
                const response = await fetch(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('Response Status:', response.status);
                const text = await response.text();
                console.log('Response Body:', text);

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`${entityName} not found`);
                    } else if (response.status === 403) {
                        throw new Error('Unauthorized access');
                    } else {
                        throw new Error('Network response was not ok');
                    }
                }

                const result = JSON.parse(text);
                const userData = Array.isArray(result.data) ? result.data[0] : result.data;
                setEntity(userData || result);

            } catch (error) {
                setError(error.message);
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntityData();
    }, [id, id_venda, id_vendedor, fetchUrl, entityName]);

    return (
        <MainLayout>
            <div className="view-entity-container">
                <Card className="view-entity-card">
                    <div className="view-entity-card-header">
                        <h4>Detalhes {entityName}</h4>
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
                                {fields.map((field) => (
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
                                    {entityName} - Não tem dados disponíveis
                                </Alert>
                            )
                        )}
                    </Card.Body>
                </Card>
            </div>
        </MainLayout>
    );
};

export default ViewPage;
