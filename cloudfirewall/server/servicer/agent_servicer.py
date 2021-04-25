import logging
from queue import Queue

from cloudfirewall.grpc import agent_pb2_grpc, agent_pb2


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
