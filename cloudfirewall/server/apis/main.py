from . import models, auth
from .database import SessionLocal, engine
from .routers import instances, securityGroups, admin
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import crud
from .schemas import adminCreate

app = FastAPI()
app.include_router(instances.router)
app.include_router(securityGroups.router)
app.include_router(admin.router)

models.Base.metadata.create_all(bind=engine)










