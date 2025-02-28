import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEntityContext } from "../context/EntityContext";
import ViewPage from "../pages/ViewPage";

const EntityViewWrapper = () => {
  const { entity, id } = useParams();
  const { changeEntity, entityConfig } = useEntityContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!entity || !id) {
      navigate("/404");
      return;
    }

    if (entityConfig.entityName.toLowerCase() !== entity) {
      changeEntity(entity);
    }
  }, [entity, id, entityConfig.entityName, changeEntity, navigate]);

  if (!entityConfig.entityName) {
    return <div>Carregando...</div>;
  }

  return (
    <ViewPage
      entityName={entityConfig.entityName}
      fetchUrl={`${entityConfig.fetchUrl}/${id}`}
      fields={entityConfig.fields}
    />
  );
};

export default EntityViewWrapper;
