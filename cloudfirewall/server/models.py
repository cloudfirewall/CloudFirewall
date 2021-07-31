from sqlalchemy import Column, Integer, String

# import Base from database.py
from database import Base

class NFT(Base):

    __tablename__ = "cloudfirewall"

    id = Column(Integer, primary_key=True, index=True)
    Firewall_table = Column(String,unique=False,index=True)
    chain = Column(String,unique=False,index=True)
    protocol = Column(String,unique=False,index=True)
    ip_address = Column(String,unique=False,index=True)
    port = Column(Integer,unique=False,index=True)
    rule = Column(String,unique=False,index=True)