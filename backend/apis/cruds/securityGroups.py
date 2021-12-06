from sqlalchemy.orm import Session
from ipaddress import IPv4Address
from fastapi import HTTPException
from .. import models, schemas, auth
import datetime
from pydantic import UUID4

def createASecurityGroup(db: Session, securityGroup: schemas.securityGroupCreate):
    if db.query(models.SecurityGroups).filter(models.SecurityGroups.name==securityGroup.name).first():
        raise HTTPException(status_code=403, detail="Security Group name aleardy exixts")
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

def readSecurityGroup(db: Session, name:str, id:UUID4, defaultInboundPolicy: schemas.policy, defaultOutboundPolicy:schemas.policy): 
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

def readSecurityGroupById(db: Session, id:UUID4):
    result= db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id).all()
    return result

def getSecurityGroupInstances(db: Session, id:UUID4):
    result= db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id).first()
    insatnces = result.instances
    return insatnces

def editSecurityGroupById(db: Session, id:UUID4, securityGroup: schemas.securityGroupEdit):
    result= db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id).first()
    if result:
        if db.query(models.SecurityGroups).filter(models.SecurityGroups.name==securityGroup.name).first():
            if result.name != securityGroup.name:
                raise HTTPException(status_code=403, detail="The name aleardy exixts")
        db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id).update({models.SecurityGroups.name:securityGroup.name, models.SecurityGroups.description:securityGroup.description, models.SecurityGroups.defaultInboundPolicy:securityGroup.defaultInboundPolicy, models.SecurityGroups.defaultOutboundPolicy:securityGroup.defaultOutboundPolicy})
        result.rules.clear()
        if securityGroup.rules:
            for rule in securityGroup.rules: 
                res= db.query(models.Rules).filter(models.Rules.protocol==rule.protocol, models.Rules.policy==rule.policy, models.Rules.port==rule.port, models.Rules.ip==str(rule.ip), models.Rules.trafficDirection==rule.trafficDirection).first()
                if not res:
                    result.rules.append(models.Rules(protocol=rule.protocol,policy=rule.policy, port=rule.port, ip=str(rule.ip), description= rule.description, trafficDirection=rule.trafficDirection))
                else:
                    result.rules.append(res)   
        db.commit()    
        return result
    else:
        raise HTTPException(status_code=404, detail="Security Group does not exist")

def deleteSecurityGroupById(db: Session, id:UUID4):
    result= db.query(models.SecurityGroups).filter(models.SecurityGroups.id==id).first()
    if result.name=="defaultSG":
        raise HTTPException(status_code=405, detail="can't delete default security Group")
    if result:
        result.rules.clear()
        db.add(result)
        db.delete(result)
        db.commit()
        return
    else:
        raise HTTPException(status_code=404, detail="Security Group does not exist")



