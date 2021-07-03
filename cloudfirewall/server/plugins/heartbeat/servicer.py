import logging

from cloudfirewall.grpc import heartbeat_pb2_grpc
from cloudfirewall.grpc.heartbeat_pb2 import PingResponse
from cloudfirewall.server.plugins.heartbeat.db import DatabaseService


class HeartbeatServicer(heartbeat_pb2_grpc.HeartbeatServicer):

    def __init__(self, server):
        self.logger = logging.getLogger(HeartbeatServicer.__name__)
        self.server = server
        self.db = DatabaseService()
        heartbeat_pb2_grpc.add_HeartbeatServicer_to_server(self, server)

    def Ping(self, request, context):
        self.logger.info("Heartbeat peer: %s", context.peer())
        self.db.save_ping_request(request, context)
        return PingResponse()
