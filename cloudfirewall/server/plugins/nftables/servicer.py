import logging

from pony.orm import db_session

from cloudfirewall.grpc import firewall_pb2_grpc
from cloudfirewall.grpc.firewall_pb2 import FirewallFetchResponse, Policy, FirewallStatusAck, FirewallRule, Chain, \
    Protocol
from cloudfirewall.server.plugins.heartbeat.entities import Node
from cloudfirewall.server.plugins.nftables.db import FirewallDatabaseService
from cloudfirewall.server.plugins.nftables.entities import SecurityGroup


class FirewallServicer(firewall_pb2_grpc.FirewallServicer):

    def __init__(self, server):
        self.logger = logging.getLogger(FirewallServicer.__name__)
        self.server = server
        firewall_pb2_grpc.add_FirewallServicer_to_server(self, server)
        self.firewall_db_service = FirewallDatabaseService()

    def _security_group_to_grpc_response(self, security_group: SecurityGroup):
        response = FirewallFetchResponse(inbound=security_group.inbound_policy, outbound=security_group.inbound_policy)
        for rule in security_group.rules:
            grpc_fw_rule = FirewallRule()
            grpc_fw_rule.chain = Chain.INPUT if rule.chain == 0 else Chain.OUTPUT
            grpc_fw_rule.protocol = Protocol.TCP if rule.protocol == 0 else Protocol.UDP
            grpc_fw_rule.ipRange = rule.ip
            grpc_fw_rule.port = rule.port
            grpc_fw_rule.policy = Policy.ACCEPT if rule.chain == 1 else Policy.DROP
            response.rules.append(grpc_fw_rule)
        return response

    def FetchLatestRules(self, request, context):
        self.logger.info("FetchLatestRules request: %s, peer: %s, node_id: %s", request.request_id, context.peer(), request.node_id)
        # pending_sg = Node
        with db_session:
            node = Node.get_by_node_id(request.node_id)
            if node:
                for node_update in node.firewall_updates:
                    print(f"pending node update: {node_update.ref_security_group}")
                    return self._security_group_to_grpc_response(node_update.ref_security_group)
        return FirewallFetchResponse(inbound=Policy.DROP, outbound=Policy.ACCEPT)

    def SendFirewallStatus(self, request, context):
        self.logger.info("SendFirewallStatus request: %s, peer: %s", request.request_id, context.peer())
        return FirewallStatusAck(success=True)
