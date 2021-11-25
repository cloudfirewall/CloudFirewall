from sqlalchemy.orm import Session
from ipaddress import IPv4Address
from . import models, schemas, auth
import datetime, jwt, logging
from passlib.context import CryptContext

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

def createAninstance(db: Session, instance: schemas.instance, token: str):
    try:
        decoded=jwt.decode(token, "CFsecret", algorithms=["HS256"])
        securityGroup=db.query(models.SecurityGroups).filter(models.SecurityGroups.name=="defaultSG").first()
        dbInstance = models.Instances(id= decoded['UUID'],name=instance.name,description=instance.description, status=instance.status, ip=str(instance.ip),creationDate=datetime.datetime.now(), securityGroupId=securityGroup.id, token=token)
        db.add(dbInstance)
        db.commit()
        db.refresh(dbInstance)
        return dbInstance
    except Exception as e:
        print(e)
    return 

def readInstance(db: Session, name:str, id:str, ip:IPv4Address , status: int): 
    result= db.query(models.Instances)
    if name:
        result=result.filter(models.Instances.name==name)
    if id:
        result=result.filter(models.Instances.id==id)
    if ip:
        result=result.filter(models.Instances.ip==ip)
    if status:
        result=result.filter(models.Instances.status==status)
    return result.all()

def deleteInstanceById(db: Session, id: str):
    result= db.query(models.Instances).filter(models.Instances.id==id)
    Instance=result.first()
    db.delete(Instance)
    db.commit()
    return 

def readInstanceById(db: Session, id: str):
    result= db.query(models.Instances).filter(models.Instances.id==id).first()
    return result

def editInstanceById(db: Session, id: str, instance: schemas.instanceEdit): 
    result= db.query(models.Instances).filter(models.Instances.id==id)
    if result:
        editedInstance = db.query(models.Instances).filter(models.Instances.id==id).update({models.Instances.name:instance.name, models.Instances.securityGroupId:instance.securityGroupId, models.Instances.description:instance.description})
        db.commit()
        return result.first()
    return

def createAdmin(db: Session, admin:schemas.adminCreate):
    result = db.query(models.Admin).filter(models.Admin.id==admin['id']).first()
    hashedPassword = auth.hashPassword(admin["password"])
    if result:
        db.query(models.Admin).filter(models.Admin.id==admin['id']).update({models.Admin.username:admin["username"], models.Admin.password:hashedPassword})
    else:
        newAdmin= models.Admin(username=admin["username"], password=hashedPassword)
        db.add(newAdmin)
    db.commit()
    return admin