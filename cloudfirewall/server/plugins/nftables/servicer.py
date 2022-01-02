import logging

from backend.apis import models
from backend.apis.utils import get_db
from cloudfirewall.grpc import firewall_pb2_grpc
from cloudfirewall.grpc.firewall_pb2 import FirewallFetchResponse, Policy, Chain, Protocol, FirewallStatusAck, FirewallRule
from backend.apis.cruds.securityGroups import readSecurityGroup, readSecurityGroupById
from backend.apis.database import SessionLocal, engine


class FirewallServicer(firewall_pb2_grpc.FirewallServicer):

    def __init__(self, server):
        self.logger = logging.getLogger(FirewallServicer.__name__)
        self.server = server
        firewall_pb2_grpc.add_FirewallServicer_to_server(self, server)

    def FetchLatestRules(self, request, context):
        self.logger.info("FetchLatestRules request: %s, peer: %s", request.request_id, context.peer())
        node_id = request.node_id
        db = SessionLocal()
        all_security_groups = db.query(models.SecurityGroups).filter(models.SecurityGroups.id == node_id).first()
        print(f'securityGroups: {all_security_groups}')
        myrule1 = FirewallRule(chain=Chain.INPUT, protocol=Protocol.TCP, ipRange="0.0.0.0/0", port=23, policy=Policy.DROP)
        myrule2 = FirewallRule(chain=Chain.OUTPUT, protocol=Protocol.TCP, ipRange="0.0.0.0/0", port=23, policy=Policy.DROP)
        return FirewallFetchResponse(inbound=Policy.DROP, outbound=Policy.ACCEPT, rules=[myrule1, myrule2])

    def SendFirewallStatus(self, request, context):
        self.logger.info("SendFirewallStatus request: %s, peer: %s", request.request_id, context.peer())
        return FirewallStatusAck(success=True)
