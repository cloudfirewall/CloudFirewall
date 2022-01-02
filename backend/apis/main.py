from .database import engine
from .routers import instances, securityGroups, admin
from fastapi import FastAPI
from . import models
from starlette.middleware.cors import CORSMiddleware
from cloudfirewall.common.util import env_to_list
import os

app = FastAPI()

ALLOWED_ORIGINS = env_to_list(os.environ.get('ALLOWED_ORIGINS', '*'))
ALLOWED_METHODS = env_to_list(os.environ.get('ALLOWED_METHODS', '*'))
ALLOWED_HEADERS = env_to_list(os.environ.get('ALLOWED_HEADERS', '*'))

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=ALLOWED_METHODS,
    allow_headers=ALLOWED_HEADERS,
)
app.include_router(instances.router)
app.include_router(securityGroups.router)
app.include_router(admin.router)

models.Base.metadata.create_all(bind=engine)










