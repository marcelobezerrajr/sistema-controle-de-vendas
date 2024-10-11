from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import logging

from app.database.models.models_vendas import User
from app.schemas.schemas_user import UserForm, UserUpdateForm

logger = logging.getLogger(__name__)

def get_all_users(db: Session):
    return db.query(User).all()

def get_user_by_id(db: Session, user_id: int):
    user = db.query(User).filter(User.id_user == user_id).first()
    if not user:
        logger.error(f"User not found with id: {user_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def create_user(db: Session, user_form: UserForm) -> User:
    try:
        if db.query(User).filter(User.email == user_form.email).first():
            logger.warning(f"Attempt to create a user with existing email: {user_form.email}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        new_user = User(
            username=user_form.username,
            email=user_form.email,
            hashed_password=user_form.hashed_password,
            permission=user_form.permission
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"User {new_user.email} created successfully.")
        return new_user
    except Exception as e:
        logger.error(f"Error creating user {user_form.email}: {str(e)}")
        raise

def update_user(db: Session, user_id: int, user_form: UserUpdateForm):
    user = db.query(User).filter(User.id_user == user_id).first()
    if not user:
        logger.error(f"User not found with id: {user_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.username = user_form.username or user.username
    user.email = user_form.email or user.email
    user.permission = user_form.permission or user.permission

    db.commit()
    db.refresh(user)
    logger.info(f"User updated successfully: {user.email}")
    return user

def delete_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id_user == user_id).first()
    if not user:
        logger.error(f"User not found with id: {user_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    db.delete(user)
    db.commit()
    logger.info(f"User deleted successfully: {user.email}")
    return user
