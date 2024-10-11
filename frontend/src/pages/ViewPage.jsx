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
            const url = `${fetchUrl}/${id}`;
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
          
              try {
                const result = JSON.parse(text);
                setEntity(result.data || result);
              } catch (jsonError) {
                throw new Error('Failed to parse JSON');
              }
            } catch (error) {
            //   setError(error.message);
            //   console.error('Fetch error:', error);
            } finally {
              setLoading(false);
            }
          };
          

        fetchEntityData();
    }, [id, fetchUrl, entityName]);

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
                                    value={entity[field.key]}
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
