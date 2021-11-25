import logging

from cloudfirewall.grpc import firewall_pb2_grpc
from cloudfirewall.grpc.firewall_pb2 import FirewallFetchResponse, Policy, FirewallStatusAck


class FirewallServicer(firewall_pb2_grpc.FirewallServicer):

    def __init__(self, server):
        self.logger = logging.getLogger(FirewallServicer.__name__)
        self.server = server
        firewall_pb2_grpc.add_FirewallServicer_to_server(self, server)

    def FetchLatestRules(self, request, context):
        self.logger.info("FetchLatestRules request: %s, peer: %s", request.request_id, context.peer())
        return FirewallFetchResponse(inbound=Policy.DROP, outbound=Policy.ACCEPT)

    def SendFirewallStatus(self, request, context):
        self.logger.info("SendFirewallStatus request: %s, peer: %s", request.request_id, context.peer())
        return FirewallStatusAck(success=True)
