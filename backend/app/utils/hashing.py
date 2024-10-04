from passlib.context import CryptContext
import logging

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

logger = logging.getLogger(__name__)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        result = pwd_context.verify(plain_password, hashed_password)
        logger.info("Password verification succeeded.")
        return result
    except Exception as e:
        logger.error(f"Password verification failed: {str(e)}")
        return False

def get_password_hash(password: str) -> str:
    try:
        hashed = pwd_context.hash(password)
        logger.info("Password hashing succeeded.")
        return hashed
    except Exception as e:
        logger.error(f"Password hashing failed: {str(e)}")
        raise
