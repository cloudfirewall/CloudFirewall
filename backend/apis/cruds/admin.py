from sqlalchemy.orm import Session
from .. import models, schemas, auth
import jwt
from passlib.context import CryptContext

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