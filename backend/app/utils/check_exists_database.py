from fastapi import HTTPException, status, logger
from sqlalchemy.orm import Session
import logging

logger = logging.getLogger(__name__)

def check_exists_database(db: Session, model, id_field: str, id_value: int, not_found_message: str):
    instance = db.query(model).filter(getattr(model, id_field) == id_value).first()
    if not instance:
        logger.error(f"{not_found_message} - ID {id_value}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=not_found_message)
    return instance
