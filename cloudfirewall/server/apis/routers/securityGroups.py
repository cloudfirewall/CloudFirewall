from fastapi import APIRouter, Depends
from typing import Optional, List
from enum import Enum
from sqlalchemy.orm import Session
from .. import schemas, crud, auth
from ..database import SessionLocal, engine
from .. import schemas

PROTECTED = [Depends(auth.auth_wrapper)]

router = APIRouter(
    prefix="/securityGroups",
    tags=["securityGroup"],
    responses={404:{"description":"Not found"}},
    dependencies=PROTECTED

)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model = schemas.securityGroup )
async def createASecurityGroup(securityGroup:schemas.securityGroupCreate, db: Session = Depends(get_db)):
    securityGroup= crud.createASecurityGroup(db, securityGroup)
    return securityGroup

@router.get("/", response_model = List[schemas.securityGroup])
async def readSecurityGroup(name: Optional[str] = None, id: Optional[str] = None, defaultInboundPolicy: Optional[schemas.policy] = None, defaultOutboundPolicy: Optional[schemas.policy] = None, db: Session = Depends(get_db)):
    securityGroups = crud.readSecurityGroup(db, name, id, defaultInboundPolicy, defaultOutboundPolicy)
    return securityGroups

@router.get("/{securityGroupId}",response_model = List[schemas.securityGroup])
async def readSecurityGroupById(securityGroupId:str, db: Session = Depends(get_db)):
    securityGroups = crud.readSecurityGroupById(db,securityGroupId)
    return securityGroups

@router.put("/{securityGroupId}", response_model = schemas.securityGroup)
async def editSecurityGroupById(securityGroupId:str,securityGroup:schemas.securityGroupEdit, db: Session = Depends(get_db)):
    SecurityGroup= crud.editSecurityGroupById(db,securityGroupId, securityGroup)
    return SecurityGroup

@router.delete("/{securityGroupId}", response_model = schemas.securityGroup)
async def deleteSecurityGroupById(securityGroupId:str,db: Session = Depends(get_db)):
    SecurityGroup= crud.deleteSecurityGroupById(db,securityGroupId)
    return SecurityGroup




