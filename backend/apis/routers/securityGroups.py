from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from sqlalchemy.orm import Session
from .. import schemas, auth
from ..database import SessionLocal, engine
from ..cruds import securityGroups as crud
from ..utils import get_db
from pydantic import UUID4

PROTECTED = [Depends(auth.auth_wrapper)]

router = APIRouter(
    prefix="/securityGroups",
    tags=["securityGroup"],
    responses={404:{"description":"Not found"}, 403:{"description":"aleardy exists"}, 500:{"description":"Internal Server Error"}},
    dependencies=PROTECTED

)

@router.post("/", response_model = schemas.securityGroup )
async def createASecurityGroup(securityGroup:schemas.securityGroupCreate, db: Session = Depends(get_db)):
    securityGroup= crud.createASecurityGroup(db, securityGroup)
    return securityGroup

@router.post("/default", status_code=201 )
async def createDefaultSecurityGroup(db: Session = Depends(get_db)):
    securityGroup= crud.createDefaultSecurityGroup(db)
    return 

@router.get("/", response_model = List[schemas.securityGroup])
async def readSecurityGroup(name: Optional[str] = None, id: Optional[UUID4] = None, defaultInboundPolicy: Optional[schemas.policy] = None, defaultOutboundPolicy: Optional[schemas.policy] = None, db: Session = Depends(get_db)):
    securityGroups = crud.readSecurityGroup(db, name, id, defaultInboundPolicy, defaultOutboundPolicy)
    if (securityGroups is None) or (len(securityGroups)==0):
        raise HTTPException(status_code=404)
    return securityGroups

@router.get("/instances", response_model=List[schemas.inastancesSecurityGroup])
async def getSecurityGroupInstances(securityGroupId:UUID4, db: Session = Depends(get_db)):
    instances = crud.getSecurityGroupInstances(db, securityGroupId)
    return instances

@router.get("/{securityGroupId}",response_model = List[schemas.securityGroup])
async def readSecurityGroupById(securityGroupId:UUID4, db: Session = Depends(get_db)):
    securityGroup = crud.readSecurityGroupById(db,securityGroupId)
    if (securityGroup is None) or (len(securityGroup)==0):
        raise HTTPException(status_code=404)
    return securityGroup

@router.put("/{securityGroupId}", response_model = schemas.securityGroup)
async def editSecurityGroupById(securityGroupId:UUID4,securityGroup:schemas.securityGroupEdit, db: Session = Depends(get_db)):
    SecurityGroup= crud.editSecurityGroupById(db,securityGroupId, securityGroup)
    return SecurityGroup

@router.delete("/{securityGroupId}", response_model = schemas.securityGroup)
async def deleteSecurityGroupById(securityGroupId:UUID4,db: Session = Depends(get_db)):
    SecurityGroup= crud.deleteSecurityGroupById(db,securityGroupId)
    return SecurityGroup




