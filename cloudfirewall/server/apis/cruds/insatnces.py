from sqlalchemy.orm import Session
from fastapi import HTTPException
from ipaddress import IPv4Address
from .. import models, schemas
import datetime
import jwt
from dotenv import load_dotenv
import os
import builtins
from pydantic import UUID4
from . import securityGroups as SecurityGroupsCrud

key=os.environ.get("JWT_INSTANCE")

def createAninstance(db: Session, instance: schemas.instance, token: str):
    try:
        decoded=jwt.decode(token, str(key), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=422, detail='Token has expired' )
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=422, detail='Invalid token')  
    securityGroup=db.query(models.SecurityGroups).filter(models.SecurityGroups.name=="defaultSG").first()
    if securityGroup is None:
        securityGroup=SecurityGroupsCrud.createDefaultSecurityGroup(db)
    res=db.query(models.Instances)
    if res.filter(models.Instances.ip==str(instance.ip)).first():
        raise HTTPException(status_code=403, detail="IP address aleardy exixts")
    if res.filter(models.Instances.name==instance.name).first():
        raise HTTPException(status_code=403, detail="Instance name aleardy exixts")
    if res.filter(models.Instances.token==token).first():
        raise HTTPException(status_code=403, detail="Instance token aleardy used")
    dbInstance = models.Instances(id= decoded['sub'],name=instance.name,description=instance.description, status=instance.status, ip=str(instance.ip),creationDate=datetime.datetime.now(), securityGroupId=securityGroup.id, token=token)
    db.add(dbInstance)
    db.commit()
    db.refresh(dbInstance)
    return dbInstance

def readInstance(db: Session, name:str, id:UUID4, ip:IPv4Address , status: int):   
    result= db.query(models.Instances)
    if name:
        result=result.filter(models.Instances.name==name)
    if id:
        result=result.filter(models.Instances.id==id)
    if ip:
        result=result.filter(models.Instances.ip==str(ip))
    if status:
        result=result.filter(models.Instances.status==status)
    return result.all()

def deleteInstanceById(db: Session, id:UUID4):
    result= db.query(models.Instances).filter(models.Instances.id==id)
    instance=result.first()
    if instance is None:
        raise HTTPException(status_code=404)
    db.delete(instance)
    db.commit()
    return 

def readInstanceById(db: Session, id:UUID4):
    result= db.query(models.Instances).filter(models.Instances.id==id).first()
    return result

def editInstanceById(db: Session, id:UUID4, instance: schemas.instanceEdit):
    result= db.query(models.Instances).filter(models.Instances.id==id).first()
    if result:
        if db.query(models.Instances).filter(models.Instances.name==instance.name).first():
            if result.name != instance.name:
                raise HTTPException(status_code=403, detail="The name aleardy exixts")
        if db.query(models.SecurityGroups).filter(models.SecurityGroups.id==instance.securityGroupId).first() is None:
            raise HTTPException(status_code=422, detail="Invalid Security Group"
        )
        editedInstance = db.query(models.Instances).filter(models.Instances.id==id).update({models.Instances.name:instance.name, models.Instances.securityGroupId:instance.securityGroupId, models.Instances.description:instance.description})
        db.commit()
        return result
    else:
        raise HTTPException(status_code=404)