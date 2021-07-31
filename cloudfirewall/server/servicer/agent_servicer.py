import logging
import urllib,requests
from queue import Queue

from cloudfirewall.grpc import agent_pb2_grpc, agent_pb2
from cloudfirewall.grpc import nft_pb2_grpc, nft_pb2


class FirewallAgentServicer(agent_pb2_grpc.AgentServicer):

    def __init__(self, server):
        self.logger = logging.getLogger(FirewallAgentServicer.__name__)

        self.server = server
        self.command_queue = Queue()

        # Add the servicers to the server
        agent_pb2_grpc.add_AgentServicer_to_server(self, server)

    def Heartbeat(self, request, context):
        self.logger.info("Heartbeat request: [request: %s, peer: %s]", request.request_id, context.peer())
        response = agent_pb2.ServerResponseAck(
            request_id=request.request_id,
        )
        return response

    def get_commands(self):
        return self.commands


class AgentFirewallServicer(nft_pb2_grpc.FirewallRulesServicer):

    def __init__(self, server):

        self.logger = logging.getLogger(AgentFirewallServicer.__name__)

        self.server = server
        self.command_queue = Queue()

        # Add the servicers to the server
        nft_pb2_grpc.add_FirewallRulesServicer_to_server(self, server)

    def Agent(self, request, context,):

        self.logger.info("Agent request: [request: %s, peer: %s]", request.request_id, context.peer())
        self.logger.info("Agent Firewall request: [request: %s, peer: %s]",request.request_rules,context.peer())

        #Below is the link of API for nft/firewall
        #Where all the rules are defined

        link = 'http://127.0.0.1:8000/nft/firewall'
        f = requests.get(link)

        response = nft_pb2.Rulesets(

           request_id=request.request_id,
           request_rules = request.request_rules,
           send_content_nft = f.text, #This line sends the response of nftables in the agent_service


        )
        return response
