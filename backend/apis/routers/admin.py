from fastapi import APIRouter, Depends,HTTPException, Security
from sqlalchemy.orm import Session
from .. import schemas
from ..cruds import admin as crud
from ..schemas import admin
from .. import models
from .. import auth
from dotenv import load_dotenv
from ..utils import get_db
import os

load_dotenv()
key= os.environ.get("JWT_ADMIN")



router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    responses={404:{"description":"Not found"}, 403:{"description":"aleardy exists"}, 500:{"description":"Internal Server Error"}},
)

adminDetails={"id":1, "username":os.environ.get("ADMIN_USER"), "password":os.environ.get("ADMIN_PASSWORD")}

@router.post('/createAdmin', status_code=200)
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


