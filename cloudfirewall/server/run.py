import os
import time
from random import random

import uvicorn
from dotenv import load_dotenv
from fastapi.openapi.utils import get_openapi
from pony import orm

# Load all environment variables from .env file
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import RedirectResponse

from cloudfirewall.common.log_util import setup_logging
from cloudfirewall.common.util import env_to_list
from cloudfirewall.db import database
from cloudfirewall.server.server import CloudServer
from backend.apis import models
from backend.apis.database import engine

load_dotenv()

SERVER_HOST = os.environ.get('SERVER_HOST', 'localhost')
SERVER_PORT = int(os.environ.get('SERVER_PORT', '50051'))

app = CloudServer(SERVER_HOST, SERVER_PORT)

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


def setup_database():
    time.sleep(random())  # to prevent all workers calling generate_mapping at the same time
    database.bind('sqlite', os.environ.get('CF_SERVER_DB', 'cf_server.db'), create_db=True)
    database.generate_mapping(create_tables=True)
    orm.sql_debug(False)


@app.get(
    "/",
    tags=["default"],
    summary='Not an API. Simply redirects to /docs endpoint.'
)
async def read_main():
    return RedirectResponse(url='/docs')


# Open API /docs or /redoc page customization
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Cloud Firewall API",
        version="1.0.0",
        description="Open API spec of Cloud Firewall",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://github.com/cloudfirewall/CloudFirewall/blob/main/docs/images/cloudfirewall-logo.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.on_event("startup")
async def startup():
    app.connect()
    app.start_grpc_server()
    database.generate_mapping(create_tables=True)
    models.Base.metadata.create_all(bind=engine)


@app.on_event("shutdown")
async def shutdown():
    app.stop_grpc_server()


if __name__ == "__main__":
    setup_logging()
    uvicorn.run("run:app", host="0.0.0.0", port=8000, log_level="info")
