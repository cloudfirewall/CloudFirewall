from sqlalchemy.orm import Session
from ipaddress import IPv4Address
from .. import models, schemas, auth
import datetime


def createASecurityGroup(db: Session, securityGroup: schemas.securityGroupCreate):
    dbSecurityGroup = models.SecurityGroups(name=securityGroup.name,description= securityGroup.description,defaultOutboundPolicy=securityGroup.defaultOutboundPolicy,defaultInboundPolicy=securityGroup.defaultInboundPolicy, creationDate=datetime.datetime.now())                  
    if securityGroup.rules:
        for rule in securityGroup.rules: 
            res= db.query(models.Rules).filter(models.Rules.protocol==rule.protocol, models.Rules.policy==rule.policy, models.Rules.port==rule.port, models.Rules.ip==str(rule.ip), models.Rules.trafficDirection==rule.trafficDirection).first()
            if not res:
                dbSecurityGroup.rules.append(models.Rules(protocol=rule.protocol,policy=rule.policy, port=rule.port, ip=str(rule.ip), description= rule.description, trafficDirection=rule.trafficDirection))
            else:
                dbSecurityGroup.rules.append(res)          
    db.add(dbSecurityGroup)
    db.commit()
    db.refresh(dbSecurityGroup)
    return dbSecurityGroup

def createDefaultSecurityGroup(db: Session):
    securityGroup=db.query(models.SecurityGroups).filter(models.SecurityGroups.name=="defaultSG").first()
    if not securityGroup:
        dbSecurityGroup = models.SecurityGroups(name="defaultSG",description= "This is the security Group to be applied by default", defaultOutboundPolicy="drop",defaultInboundPolicy="drop", creationDate=datetime.datetime.now())
        db.add(dbSecurityGroup)
        db.commit()
        db.refresh (dbSecurityGroup)
    return

def readSecurityGroup(db: Session, name:str, id:str, defaultInboundPolicy: schemas.policy, defaultOutboundPolicy:schemas.policy): 
    result= db.query(models.SecurityGroups)
    if name:
        result=result.filter(models.SecurityGroups.name==name)
    if id:
        result=result.filter(models.SecurityGroups.id==id)
    if defaultInboundPolicy:
        result=result.filter(models.SecurityGroups.defaultInboundPolicy==defaultInboundPolicy)
    if defaultOutboundPolicy:
        result=result.filter(models.SecurityGroups.defaultOutboundPolicy==defaultOutboundPolicy)
    return result.all()

def readSecurityGroupById(db: Session, id: str):
    result= db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id).all()
    return result

def getSecurityGroupInstances(db: Session, id:str):
    result= db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id).first()
    insatnces = result.instances
    return insatnces

def editSecurityGroupById(db: Session, id: str, securityGroup: schemas.securityGroupEdit):
    result= db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id).first()
    if result:
        deleteSecurityGroupById(db,result.id)           
    editedSG =createASecurityGroup(db, securityGroup)
    db.commit()    
    return editedSG

def deleteSecurityGroupById(db: Session, id: str):
    result= db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id)
    securityGroup=result.first()
    rules = securityGroup.rules
    securityGroup.rules.clear()
    db.add(securityGroup)
    db.delete(securityGroup)
    db.commit()
    return 



