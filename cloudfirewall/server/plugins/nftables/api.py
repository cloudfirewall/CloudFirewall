import logging

from fastapi import APIRouter, Depends
from pony.orm import db_session

from cloudfirewall.server.plugins.common.exceptions import BadRequest
from cloudfirewall.server.plugins.heartbeat.entities import Node
from cloudfirewall.server.plugins.nftables.db import FirewallDatabaseService
from cloudfirewall.server.plugins.nftables.dto import CreateFirewallRequest, RulesetRequest, FirewallRuleRequest
from cloudfirewall.server.plugins.nftables.entities import SecurityGroup, SecurityGroupRule
from cloudfirewall.server.plugins.heartbeat.db import DatabaseService as NodeDatabaseService

router = APIRouter()
firewall_db_service = FirewallDatabaseService()
node_db_service = NodeDatabaseService()
logger = logging.getLogger(__name__)


async def get_firewall_group_by_id(firewall_id: int):
    firewall = firewall_db_service.get_firewall_group(firewall_id)
    if not firewall:
        raise BadRequest(f"Firewall Group[{firewall_id}] does not exist")
    return firewall


async def get_firewall_rule_by_id(rule_id: int):
    rule = firewall_db_service.get_firewall_rule(rule_id)
    if not rule:
        raise BadRequest(f"Firewall Rule[{rule_id}] does not exist")
    return rule


async def get_node_by_id(node_id: str):
    node = node_db_service.get_node_by_id(node_id)
    if not node:
        raise BadRequest(f"Node[{node_id}] does not exist")
    return node


@router.get(
    "/firewall",
    tags=["Firewall API"],
    summary="Returns list of all firewall groups"
)
async def list_firewall_groups():
    logger.info(f"Received list firewall group request")
    with db_session:
        return [group.json() for group in firewall_db_service.list_firewall_groups()]


@router.get(
    "/firewall/{firewall_id}",
    tags=["Firewall API"],
    summary="Returns details of a firewall group",
    status_code=200
)
async def get_firewall_group(firewall: SecurityGroup = Depends(get_firewall_group_by_id)):
    logger.info(f"Received get firewall group request: {firewall}")
    with db_session:
        return SecurityGroup[firewall.id].json()


@router.post(
    "/firewall",
    tags=["Firewall API"],
    summary="Creates a new firewall group",
    status_code=201
)
async def create_firewall_group(create_request: CreateFirewallRequest):
    logger.info(f"Received create firewall request: {create_request}")
    with db_session:
        firewall_db_service.create_firewall_group(create_request)


@router.post(
    "/firewall/{firewall_id}/rules",
    tags=["Firewall API"],
    summary="Add a firewall rule to firewall group"
)
async def add_firewall_rule(rule: FirewallRuleRequest,
                            firewall: SecurityGroup = Depends(get_firewall_group_by_id)):
    logger.info(f"Received create firewall request: {rule} to group: {firewall}")
    with db_session:
        if firewall.locked:
            raise BadRequest("Firewall group is locked.")
        firewall_db_service.add_rule_in_group(firewall, rule)


@router.post(
    "/firewall/{firewall_id}/apply",
    tags=["Firewall API"],
    summary="Schedule apply a firewall group to a node"
)
async def apply_firewall_group(firewall: SecurityGroup = Depends(get_firewall_group_by_id),
                               node: Node = Depends(get_node_by_id)):
    logger.info(f"Received firewall group application request[{firewall.id}] to node: {node.node_id}")
    with db_session:
        firewall_db_service.apply_firewall_group(firewall, node)


@router.put(
    "/firewall/{firewall_id}/rules/{rule_id}",
    tags=["Firewall API"],
    summary="Update firewall rule",
    status_code=200
)
async def update_firewall_rule(rule_request: FirewallRuleRequest,
                            firewall_ro: SecurityGroup = Depends(get_firewall_group_by_id),
                            rule_ro: SecurityGroupRule = Depends(get_firewall_rule_by_id)):
    logger.info(f"Received create firewall request: {rule_request}")
    with db_session:
        firewall_db_service.update_rule_in_group(rule_ro, rule_request)


@router.delete(
    "/firewall/{firewall_id}/rules/{rule_id}",
    tags=["Firewall API"],
    summary="Delete a firewall rule",
    status_code=200
)
async def update_firewall_rule(firewall_ro: SecurityGroup = Depends(get_firewall_group_by_id),
                               rule_ro: SecurityGroupRule = Depends(get_firewall_rule_by_id)):
    logger.info(f"Received delete firewall request: {rule_ro}")
    with db_session:
        firewall_db_service.delete_rule_in_group(rule_ro)
