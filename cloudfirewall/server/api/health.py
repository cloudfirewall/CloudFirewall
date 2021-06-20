from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Depends
from pony import orm
from pony.orm import desc

router = APIRouter()


@router.get(
    "/health",
    tags=["Health API"],
    summary="Returns health of all servers"
)
async def get_healths():
    with orm.db_session:
        return {
            "name": "hello"
        }
