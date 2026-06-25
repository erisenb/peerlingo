import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

_db_path = os.environ.get(
    "VP_DB_PATH",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "virtual_peers.db"),
)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{_db_path}"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
