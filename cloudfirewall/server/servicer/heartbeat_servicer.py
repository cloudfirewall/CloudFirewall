import logging

from cloudfirewall.grpc import heartbeat_pb2_grpc
from cloudfirewall.grpc.heartbeat_pb2 import PingResponse


class HeartbeatServicer(heartbeat_pb2_grpc.HeartbeatServicer):

    def __init__(self, server):
        self.logger = logging.getLogger(HeartbeatServicer.__name__)
        self.server = server
        heartbeat_pb2_grpc.add_HeartbeatServicer_to_server(self, server)

    def Ping(self, request, context):
        self.logger.info("Heartbeat ping: %s, peer: %s", request.request_id, context.peer())
        return PingResponse(request_id=request.request_id)
