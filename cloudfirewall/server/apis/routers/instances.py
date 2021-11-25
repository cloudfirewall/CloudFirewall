from fastapi import APIRouter, Depends, Header
from typing import Optional, List
from enum import Enum
from sqlalchemy.orm import Session
from ipaddress import IPv4Address
from .. import schemas, crud, auth
from ..database import SessionLocal, engine
from .. import schemas
import jwt
import datetime, uuid, json

key="CFsecret"
PROTECTED = [Depends(auth.auth_wrapper)]

router = APIRouter(
    prefix="/instances",
    tags=["instance"],
    responses={404:{"description":"Not found"}},
    dependencies=PROTECTED

)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def defaultconverterDateTime(o):
  if isinstance(o, datetime.datetime):
      return o.__str__()




@router.post("/", response_model = schemas.instance)
async def createAninstance(instance:schemas.instanceCreate, db: Session = Depends(get_db), token:str= Header(None)):
    if token:
        instance= crud.createAninstance(db, instance, token)
    else:
        instance = None
    return instance

@router.get("/", response_model = List[schemas.instance])
async def readinstance(name: Optional[str] = None, id: Optional[str] = None, ip: Optional[IPv4Address] = None, status: Optional[int] = None, db: Session = Depends(get_db)):
    instances = crud.readInstance(db, name, id, ip, status)
    return instances

@router.get("/token")
async def generateToken():
    UUID = uuid.uuid4()
    payload= {"cretaedAt": json.dumps(datetime.datetime.now(),default = defaultconverterDateTime), "UUID":str(UUID)}
    encodedToken=jwt.encode(payload, key)
    return encodedToken


@router.get("/{instanceId}",response_model = schemas.instance)
async def readinstanceById(instanceId:str, db: Session = Depends(get_db)):
    instances = crud.readInstanceById(db,instanceId)
    return instances

@router.put("/{instanceId}", response_model = schemas.instance)
async def editInstanceById(instanceId:str,instance:schemas.instanceEdit, db: Session = Depends(get_db)):
    instance= crud.editInstanceById(db,instanceId, instance)
    return instance
    

@router.delete("/{instanceId}")
async def deleteInstanceById(instanceId:str,db: Session = Depends(get_db)):
    instance= crud.deleteInstanceById(db,instanceId)
    return instance


