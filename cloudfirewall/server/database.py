from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Connect to SQLite database

SQLALCHEMY_DATABASE_URL = "sqlite:///./CloudFirewall.db"

# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # connect_args is needed for SQlite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Use this function to return class
Base = declarative_base()