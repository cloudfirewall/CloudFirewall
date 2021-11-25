import logging

from fastapi import APIRouter
from pony.orm import db_session

from cloudfirewall.server.plugins.heartbeat.db import DatabaseService

router = APIRouter()
db = DatabaseService()
logger = logging.getLogger(__name__)


@router.get(
    "/nodes",
    tags=["Node API"],
    summary="Returns nodes latest ping status"
)
async def get_node_status():
    with db_session:
        return [ping_status.json() for ping_status in db.get_nodes_status()]


@router.get(
    "/nodes/{node_ip}",
    tags=["Node API"],
    summary="Returns nodes latest ping status"
)
async def get_ping_history(node_ip: str, from_ts: int = None, to_ts: int = None):
    logger.info(f"Received node history request for {node_ip}")
    with db_session:
        return [ping.timestamp for ping in db.get_ping_history(node_ip, from_ts, to_ts)]
