import logging
import os
import platform
import time
import uuid

from cloudfirewall.agent.plugins.common.agent_service import AgentService
from cloudfirewall.grpc import heartbeat_pb2_grpc
from cloudfirewall.grpc.heartbeat_pb2 import PingRequest

HEARTBEAT_INTERVAL = 5  # Seconds


class HeartbeatService(AgentService):

    def __init__(self, agent, channel):
        self.logger = logging.getLogger(HeartbeatService.__name__)
        super(HeartbeatService, self).__init__(agent, channel)

        # Setup the stub for GRPC service
        self.stub = heartbeat_pb2_grpc.HeartbeatStub(self.channel)

        # Schedule all periodic tasks
        self.register_task("send_ping", self.send_ping, interval=HEARTBEAT_INTERVAL)

    def get_nodename(self):
        if platform.system() != 'Windows':
            return os.uname().nodename
        else:
            return platform.uname().node

    def send_ping(self):
        ping_time = time.time()
        request_id = str(uuid.uuid4())
        ping_request = PingRequest(
            node_id=self.agent.agent_uuid,
            node_name=self.get_nodename(),
        )

        ping_response = self.get_response(self.stub.Ping, ping_request)
        if ping_response:
            response_time = (time.time() - ping_time) * 1000
            self.logger.info(f"Heartbeat ping response: {response_time} ms")
