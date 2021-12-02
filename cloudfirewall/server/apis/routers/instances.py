from fastapi import APIRouter, Depends, Header, HTTPException
from typing import Optional, List
from sqlalchemy.orm import Session
from pydantic import UUID4
from ipaddress import IPv4Address
from .. import schemas, auth
from ..cruds import insatnces as crud
from ..database import SessionLocal, engine
from datetime import datetime, timedelta
import json, uuid
import jwt
from ..utils import get_db
from dotenv import load_dotenv
import os



key=os.environ.get("JWT_INSTANCE")
PROTECTED = [Depends(auth.auth_wrapper)]

router = APIRouter(
    prefix="/instances",
    tags=["instance"],
    responses={404:{"description":"Not found"}, 403:{"description":"aleardy exists"}, 500:{"description":"Internal Server Error"}},
    dependencies=PROTECTED

)

@router.post("/", response_model = schemas.instance)
async def createAninstance(instance:schemas.instanceCreate, db: Session = Depends(get_db), token:str= Header(None)):
    if token:
        instance= crud.createAninstance(db, instance, token)
        return instance
    else:
        raise HTTPException(status_code=422, detail="No token")
    

@router.get("/", response_model = List[schemas.instance])
async def readinstance(name: Optional[str] = None, id: Optional[UUID4] = None, ip: Optional[IPv4Address] = None, status: Optional[int] = None, db: Session = Depends(get_db)):
    instances = crud.readInstance(db, name, id, ip, status)
    if (instances is None) or (len(instances)==0):
        raise HTTPException(status_code=404)
    return instances


@router.get("/token")
async def generateToken():
    UUID = uuid.uuid4()  
    payload= {'exp':datetime.utcnow()+timedelta(days=1),
              'iat': datetime.utcnow(),
              'sub': str(UUID)}
    encodedToken=jwt.encode(payload, str(key))
    return encodedToken


@router.get("/{instanceId}",response_model = schemas.instance)
async def readinstanceById(instanceId:UUID4, db: Session = Depends(get_db)):
    instance = crud.readInstanceById(db,instanceId)
    if instance is None:
        raise HTTPException(status_code=404)
    return instance

@router.put("/{instanceId}", response_model = schemas.instance)
async def editInstanceById(instanceId:UUID4,instance:schemas.instanceEdit, db: Session = Depends(get_db)):
    instance= crud.editInstanceById(db,instanceId, instance)
    if instance is None:
        raise HTTPException(status_code=404)
    return instance
    

@router.delete("/{instanceId}", status_code=200)
async def deleteInstanceById(instanceId:UUID4,db: Session = Depends(get_db)):
    crud.deleteInstanceById(db,instanceId)
    return {"detail":"Successfully deletd"}


