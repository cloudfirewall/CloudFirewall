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


#Query for selecting columns


def get_firewall_tables():
    tables = []
    with engine.connect() as con:

        rs = con.execute('SELECT Firewall_table FROM cloudfirewall')

        for row in rs:
            print(row)
            tables.append(row)

    return tables

def get_firwall_chains():
    chains = []
    with engine.connect() as con:
        rs = con.execute('SELECT chain FROM cloudfirewall')

        for row in rs:
            print(row)
            chains.append(row)

    return chains

def get_firwall_protocol():
    protocol = []
    with engine.connect() as con:
        rs = con.execute('SELECT protocol FROM cloudfirewall')

        for row in rs:
            print(row)
            protocol.append(row)

    return protocol

def get_firewall_port():
    port = []
    with engine.connect() as con:
        rs = con.execute('SELECT port FROM cloudfirewall')

        for row in rs:
            print(row)
            port.append(row)

    return port





