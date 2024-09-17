from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Definindo a URL de conexão com o SQLite
SQLALCHEMY_DATABASE_URL = "sqlite:///./vendas.db"

# Configurando o motor de conexão
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para criação de tabelas
Base = declarative_base()

# Dependência para obter sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
