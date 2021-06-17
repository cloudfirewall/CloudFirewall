import logging
import os
import time
import uuid

import grpc

from cloudfirewall.common.taskmanager import TaskManager
from cloudfirewall.grpc import agent_pb2_grpc
from cloudfirewall.grpc.agent_pb2 import HeartbeatRequest
from cloudfirewall.version import VERSION

HEARTBEAT_INTERVAL = 5  # Seconds


class HeartbeatService(TaskManager):

    def __init__(self, agent, channel):
        self.logger = logging.getLogger(HeartbeatService.__name__)
        super(HeartbeatService, self).__init__()

        self.agent = agent
        self.channel = channel

        # Setup the stub for GRPC service
        self.stub = agent_pb2_grpc.AgentStub(self.channel)

        # Schedule all periodic tasks
        self.register_task("send_heartbeat", self.send_heartbeat, interval=HEARTBEAT_INTERVAL)

    def send_heartbeat(self):
        uname = os.uname()
        heartbeat_request = HeartbeatRequest(version=VERSION,
                                             request_id=str(uuid.uuid4()),
                                             node_id=self.agent.agent_uuid,
                                             node_name=uname.nodename,
                                             timestamp=int(time.time()))

        try:
            response = self.stub.Heartbeat(heartbeat_request)
            self.logger.info(f"Heartbeat response: [request_id: %s]", response.request_id)
        except grpc.RpcError as rpc_error:
            if rpc_error.code() == grpc.StatusCode.CANCELLED:
                self.logger.error("GRPC service cancelled")
            elif rpc_error.code() == grpc.StatusCode.UNAVAILABLE:
                self.logger.error("GRPC service unavailable")
            else:
                self.logger.error(f"Unknown RPC error: code={rpc_error.code()}, message={rpc_error.details()}")
