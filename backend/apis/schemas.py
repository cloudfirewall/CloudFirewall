from typing import List, Optional
from pydantic import BaseModel, UUID4
from enum import Enum
from ipaddress import IPv4Network, IPv4Address
import datetime

class policy(str, Enum):
    accept = "accept"
    reject = "reject"
    drop = "drop"

class trafficDirection(str, Enum):
    inbound = "inbound"
    outbound = "outbound"

class protocol(str, Enum):
    TCP="TCP"
    UDP="UDP"

class ruleBase(BaseModel):
    protocol: protocol
    policy: policy
    port: int
    ip: IPv4Network
    description: Optional[str] = None
    trafficDirection: trafficDirection
    class Config:  
        use_enum_values = True
        orm_mode = True

class securityGroupBase(BaseModel):
    name: str
    description: Optional[str]
    defaultInboundPolicy: policy
    defaultOutboundPolicy: policy
    rules: Optional[List[ruleBase]] = None

class securityGroupCreate(securityGroupBase):
    pass 

class securityGroupEdit(securityGroupBase):
    pass
   
class securityGroup(securityGroupBase):
    id: UUID4
    creationDate:datetime.datetime
    class Config:
        orm_mode = True
      
class instanceBase(BaseModel):
    name: str
    description: Optional[str] = None

class instanceCreate(instanceBase):
    status: int = 1
    ip: IPv4Address

class instance(instanceBase):
    id: UUID4
    securityGroup: Optional[securityGroup] 
    ip: IPv4Address
    status: int
    creationDate:datetime.datetime
    appliedRules: Optional[List[ruleBase]] = None
    class Config:
        orm_mode = True

class inastancesSecurityGroup(instanceBase):
    ip: IPv4Address
    id: UUID4
    class Config:
        orm_mode = True

class instanceEdit(instanceBase):
    securityGroupId: UUID4

class adminBase(BaseModel):
    username: str

class adminCreate(adminBase):
    id: int= 1
    password: str

class admin(adminBase):
    password:str
    class Config:
        orm_mode = True


