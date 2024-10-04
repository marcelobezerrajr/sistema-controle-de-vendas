from fastapi import APIRouter, Request, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from datetime import timedelta
from dotenv import load_dotenv
import os
import logging

from app.services.services_user import get_all_users, get_user_by_id, create_user, update_user, delete_user
from app.schemas.schemas_user import UserForm, UserUpdateForm, UserOut
from app.schemas.schemas_response import UsersListResponse
from app.database.models.models_vendas import User
from app.api.depends import get_db, get_admin_user, get_user_admin, get_read_user_admin
from app.core.security import create_access_token
from app.utils.validate_password import validate_password

user_router = APIRouter(prefix="/user")

load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES'))

logger = logging.getLogger(__name__)

@user_router.get("/", response_model=UsersListResponse)
def list_users_route(db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        users = get_all_users(db)
        logger.info(f"Users listed successfully by admin: {current_user.email}")
        return {
            "status": "success",
            "message": "Listed users successfully.",
            "data": [UserOut.from_orm(user) for user in users],
            "access_token": None,
            "token_type": None
        }
    except Exception as e:
        logger.error(f"Error listing users: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while listing users.")

@user_router.get("/view/{user_id}", response_model=UsersListResponse)
def view_user_route(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_read_user_admin)):
    try:
        user = get_user_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.email}, expires_delta=access_token_expires
        )
        logger.info(f"User details retrieved successfully by user: {current_user.email}")
        return {
            "status": "success",
            "message": "User details retrieved successfully.",
            "data": [UserOut.from_orm(user)],
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Error view user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while view user.")
    
@user_router.post("/create", response_model=UsersListResponse)
def create_user_route(db: Session = Depends(get_db), user_form: UserForm = Body(...), current_user: User = Depends(get_user_admin)):
    try:
        if not validate_password(user_form.hashed_password):
            logger.warning(f"Password does not meet criteria for user {user_form.email}")
            raise HTTPException(status_code=400, detail="Password does not meet the required criteria.")
        
        new_user = create_user(db, user_form)
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user_form.email}, expires_delta=access_token_expires
        )
        logger.info(f"User {new_user.email} created successfully by {current_user.email}.")
        return {
            "status": "success",
            "message": "User created successfully!",
            "data": [UserOut.from_orm(new_user)],
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException as he:
        logger.error(f"HTTP error creating user {user_form.email}: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Error creating user {user_form.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while creating user.")

@user_router.put("/update/{user_id}", response_model=UsersListResponse)
def update_user_route(user_id: int, user_form: UserUpdateForm, db: Session = Depends(get_db), current_user: User = Depends(get_user_admin)):
    try:
        user = update_user(db, user_id, user_form)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.email}, expires_delta=access_token_expires
        )
        logger.info(f"User updated successfully by user: {current_user.email}")
        return {
            "status": "success",
            "message": "User updated successfully!",
            "data": [UserOut.from_orm(user)],
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Error update user {user_form.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while update user.")

@user_router.delete("/delete/{user_id}", response_model=UsersListResponse)
def delete_user_route(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_admin_user)):
    try:
        user = delete_user(db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.email}, expires_delta=access_token_expires
        )
        logger.info(f"User deleted successfully by admin: {current_user.email}")
        return {
            "status": "success",
            "message": "User deleted successfully!",
            "data": [UserOut.from_orm(user)],
            "access_token": access_token,
            "token_type": "bearer"
        }
    except Exception as e:
        logger.error(f"Error delete user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while delete user.")
