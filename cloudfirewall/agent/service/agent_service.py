from _typeshed import Self
import logging
import os
import time
import uuid

import grpc


from cloudfirewall.common.taskmanager import TaskManager
from cloudfirewall.grpc import agent_pb2_grpc
from cloudfirewall.grpc.agent_pb2 import HeartbeatRequest

from cloudfirewall.grpc import nft_pb2_grpc
from cloudfirewall.grpc.nft_pb2 import RulesetRequest

from cloudfirewall.version import VERSION

HEARTBEAT_INTERVAL = 3  # Seconds

RULESET_INTERVAL = 2


class AgentService(TaskManager):

    def __init__(self, agent, channel):
        self.logger = logging.getLogger(AgentService.__name__)
        super(AgentService, self).__init__()

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



class AgentFirewall(TaskManager):

    def __init__(self, agent, channel):
        self.logger = logging.getLogger(AgentFirewall.__name__)
        super(AgentFirewall, self).__init__()

        self.agent = agent
        self.channel = channel

        # Setup the stub for GRPC service
        self.stub = nft_pb2_grpc.FirewallRulesStub(self.channel)

        # Schedule all periodic tasks

        self.register_task("send_rulesets", self.send_rulesets, interval=RULESET_INTERVAL)


    def send_rulesets(self):

        ruleset_request = RulesetRequest(request_id = str(uuid.uuid4()))


        try:

            response = self.stub.Agent(ruleset_request)
            self.logger.info(response.request_id)
            self.logger.info(response.send_content_nft)
            self.logger.info(response)


            # firewall.nft file will be created where all the response of the agent_servicer are stored
            with open("firewall.nft","w") as f:
                firewall_content = response.send_content_nft[1:-1]  #[1:-1] removes the last character i.e ""
                for line in firewall_content.split("\\n"):
                    if line:
                        print(f"line: {line}")
                        f.write(line+"\n")



            #The generated firewall.nft will be read on the system
            #and firewall rules will be implemented


            #--------------uncomment the below line to run the command---------
            #--------------replace the password with your system password---------

            # sudoPassword = ''    #senitive

            # command__to_read_nft_file = f'nft -f firewall.nft'

           
            # f = os.system('echo %s|sudo -S %s' % (sudoPassword, command__to_read_nft_file))
            # print(f)



        except grpc.RpcError as rpc_error:
            if rpc_error.code() == grpc.StatusCode.CANCELLED:
                self.logger.error("GRPC service cancelled")
            elif rpc_error.code() == grpc.StatusCode.UNAVAILABLE:
                self.logger.error("GRPC service unavailable")
            else:
                self.logger.error(f"Unknown RPC error: code={rpc_error.code()}, message={rpc_error.details()}")

