from sqlalchemy.orm import Session
from ipaddress import IPv4Address
from .. import models, schemas
import datetime
import jwt
from dotenv import load_dotenv
import os

key=os.environ.get("JWT_INSTANCE")

def createAninstance(db: Session, instance: schemas.instance, token: str):
    try:
        decoded=jwt.decode(token, key, algorithms=["HS256"])
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