from fastapi import APIRouter, Depends, Header, HTTPException, Security
from typing import Optional, List
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import SessionLocal, engine
import jwt
from ..schemas import admin
from .. import models
from .. import auth

key="CFsecret"

PROTECTED = [Depends(auth.auth_wrapper)]
router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404:{"description":"Not found"}},
    dependencies=PROTECTED
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post('/createAdmin', status_code=201)
async def addAdmin(db: Session = Depends(get_db)): 
    crud.createAdmin(db, adminDetails)
    return 

@router.post('/login')
def login(admin:schemas.admin, db: Session = Depends(get_db)):
    user= db.query(models.Admin).filter(models.Admin.username==admin.username).first()
    if (user is None) or (not auth.verifyPassword(admin.password, user.password)):
        raise HTTPException(status_code=401, detail='Invalid username and/or password')
    else:
        token=auth.encode_token(user.username)
    return {'token':token}


