from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/rocketlaunch").replace("postgres://", "postgresql://")

engine = create_engine(DATABASE_URL) ##acts as the primary source of connectivity to a database.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) ##a factory for creating DB sessions

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()