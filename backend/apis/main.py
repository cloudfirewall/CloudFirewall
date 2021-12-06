from .database import engine
from .routers import instances, securityGroups, admin
from fastapi import FastAPI
from . import models


app = FastAPI()
app.include_router(instances.router)
app.include_router(securityGroups.router)
app.include_router(admin.router)

models.Base.metadata.create_all(bind=engine)










