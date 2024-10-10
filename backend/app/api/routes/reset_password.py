from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt, JWTError
from datetime import timedelta, datetime
from dotenv import load_dotenv
import logging
import uuid
import os

from app.database.models.models_vendas import User
from app.utils.email import send_reset_password_email, send_password_reset_confirmation_email
from app.utils.hashing import get_password_hash
from app.schemas.schemas_response import EmailRequest, ResetPasswordRequest, TokenRequest
from app.api.depends import get_db
from app.utils.validate_password import validate_password

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')
ALGORITHM = os.getenv('ALGORITHM')
RESET_TOKEN_EXPIRY_HOURS = int(os.getenv('RESET_TOKEN_EXPIRY_HOURS'))

if not SECRET_KEY or not ALGORITHM:
    raise ValueError("SECRET_KEY and ALGORITHM must be set in environment variables")

reset_password_router = APIRouter(prefix="/reset-password")

logger = logging.getLogger(__name__)

def create_reset_token(id_user: str):
    token_expires = timedelta(hours=RESET_TOKEN_EXPIRY_HOURS)
    return jwt.encode(
        {"sub": id_user, "jti": str(uuid.uuid4()), "exp": datetime.utcnow() + token_expires},
        SECRET_KEY, algorithm=ALGORITHM
    )

@reset_password_router.post("/request-password")
def forgot_password(request: EmailRequest, db: Session = Depends(get_db)):
    email = request.email
    if '@' not in email or '.' not in email:
        raise HTTPException(status_code=400, detail="Formato de email inválido.")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        logger.warning(f"Solicitação de redefinição de senha para e-mail inexistente: {email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email não encontrado",
        )
    
    token = create_reset_token(str(user.id_user))
    user.reset_password_token = token
    user.reset_token_expires_at = datetime.utcnow() + timedelta(hours=RESET_TOKEN_EXPIRY_HOURS)
    db.commit()

    try:
        send_reset_password_email(email, token)
        logger.info(f"Token de redefinição de senha enviado para {email}")
    except Exception as e:
        logger.error(f"Não foi possível enviar e-mail de redefinição de senha para {email}: {e}")
        raise HTTPException(status_code=500, detail=f"Falha ao enviar e-mail de redefinição para {email}. Por favor, tente novamente mais tarde.")
    
    return {"message": "E-mail de redefinição de senha enviado com sucesso"}

@reset_password_router.post("/verify")
def verify_reset_token(request: TokenRequest, db: Session = Depends(get_db)):
    token = request.token
    if not token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="O token é obrigatório")
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id_user: str = payload.get("sub")
        jti: str = payload.get("jti")
        if not id_user or not jti:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Estrutura de token inválida",
            )
    except JWTError as e:
        logger.error(f"Falha na verificação do token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    user = db.query(User).filter(User.id_user == id_user).first()
    if not user or user.reset_password_token != token or user.reset_token_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    return {"message": "Token is valid"}

@reset_password_router.post("/reset")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(request.token, SECRET_KEY, algorithms=[ALGORITHM])
        id_user: str = payload.get("sub")
        jti: str = payload.get("jti")
        if not id_user or not jti:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Estrutura de token inválida",
            )
    except JWTError as e:
        logger.error(f"Token verification failed during reset: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    user = db.query(User).filter(User.id_user == id_user).first()
    if not user or user.reset_password_token != request.token or user.reset_token_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
        )

    if not validate_password(request.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A senha não atende aos requisitos de complexidade",
        )

    user.hashed_password = get_password_hash(request.new_password)
    user.reset_password_token = None
    user.reset_token_expires_at = None
    db.commit()

    try:
        send_password_reset_confirmation_email(user.email)
        logger.info(f"Redefinição de senha com sucesso para ID de usuário: {id_user}")
    except Exception as e:
        logger.error(f"Falha ao enviar e-mail de confirmação: {e}")
    
    return {"message": "Redefinição de senha com sucesso"}
