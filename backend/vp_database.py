import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# DATABASE_URL env var = PostgreSQL (production on Render)
# Falls back to SQLite for local development
_database_url = os.environ.get("DATABASE_URL", "")

if _database_url.startswith("postgres://"):
    # Render gives postgres:// but SQLAlchemy requires postgresql://
    _database_url = _database_url.replace("postgres://", "postgresql://", 1)

if _database_url.startswith("postgresql"):
    SQLALCHEMY_DATABASE_URL = _database_url
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
else:
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
