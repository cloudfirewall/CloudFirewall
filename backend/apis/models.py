from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Table, Enum, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy_utils import UUIDType
from .database import Base
import datetime
import uuid


rulesAssocialtionTable = Table('rulesAssociation', Base.metadata,
    Column('ruleId', ForeignKey('rule.id')),
    Column('securityGroupId', ForeignKey('securityGroup.id'))
)
rulesInstancesAssocialtionTable = Table('rulesInstancesAssocialtion', Base.metadata,
    Column('ruleId', ForeignKey('rule.id')),
    Column('InstanceId', ForeignKey('instance.id'))
)

class SecurityGroups(Base):
    __tablename__ = 'securityGroup'
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, unique= True, index=True)
    description = Column(String)
    creationDate = Column(DateTime, default = datetime.datetime)
    defaultInboundPolicy = Column(String)
    defaultOutboundPolicy = Column(String)
    rules = relationship ("Rules", secondary=rulesAssocialtionTable, back_populates="securityGroups")
    instances= relationship("Instances", back_populates="securityGroup")

class Rules(Base):
    __tablename__='rule'
    UniqueConstraint("protocol", "ip", "port", "policy","trafficDirection")
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4, index=True)
    protocol = Column(String)
    ip = Column(String)
    port = Column(Integer)
    policy = Column(String)
    description = Column(String)
    trafficDirection = Column (String)
    securityGroups = relationship ("SecurityGroups", secondary=rulesAssocialtionTable)
    instances = relationship ("Instances", secondary=rulesInstancesAssocialtionTable)
    
class Instances(Base):
    __tablename__ = 'instance'
    id = Column(UUIDType(binary=False), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, unique= True, index=True)
    token = Column(String, unique= True)
    ip = Column((String), unique= True, index=True)
    description = Column(String)
    creationDate = Column(DateTime, default = datetime.datetime)
    status = Column(Integer)
    securityGroupId = Column("securityGroupId", ForeignKey('securityGroup.id'))
    securityGroup = relationship("SecurityGroups", back_populates='instances')
    appliedRules = relationship ("Rules", secondary=rulesInstancesAssocialtionTable, back_populates="instances")

class Admin(Base):
    __tablename__='admin'
    id = Column(Integer, primary_key=True,index=True, default=1)
    username = Column(String, unique= True)
    password = Column(String) 

