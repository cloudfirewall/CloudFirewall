import logging

import grpc

from cloudfirewall.common.taskmanager import TaskManager


class AgentService(TaskManager):

    def __init__(self, agent, channel):
        self.logger = logging.getLogger(self.__class__.__name__)
        super(AgentService, self).__init__()

        self.agent = agent
        self.channel = channel

    def get_response(self, stub, request):
        try:
            return stub(request)
        except grpc.RpcError as rpc_error:
            if rpc_error.code() == grpc.StatusCode.CANCELLED:
                self.logger.error("GRPC service cancelled")
            elif rpc_error.code() == grpc.StatusCode.UNAVAILABLE:
                self.logger.error("GRPC service unavailable")
            else:
                self.logger.error(f"Unknown RPC error: code={rpc_error.code()}, message={rpc_error.details()}")
        return None
