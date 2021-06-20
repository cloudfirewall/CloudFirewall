import logging
import time
import uuid

from cloudfirewall.agent.service.agent_service import AgentService
from cloudfirewall.grpc import firewall_pb2_grpc
from cloudfirewall.grpc.firewall_pb2 import FirewallFetchRequest

FIREWALL_FETCH_INTERVAL = 5  # Seconds
FIREWALL_STATUS_INTERVAL = 5  # Seconds


class FirewallService(AgentService):
    VERSION = "0.0.1"

    def __init__(self, agent, channel):
        self.logger = logging.getLogger(FirewallService.__name__)
        super(FirewallService, self).__init__(agent, channel)

        # Setup the stub for GRPC service
        self.stub = firewall_pb2_grpc.FirewallStub(self.channel)

        # Schedule all periodic tasks
        self.register_task("fetch_latest_rules", self.fetch_latest_rules, interval=FIREWALL_FETCH_INTERVAL)
        self.register_task("send_firewall_status", self.send_firewall_status, interval=FIREWALL_STATUS_INTERVAL)

    def fetch_latest_rules(self):
        ping_time = time.time()
        request_id = str(uuid.uuid4())

        fetch_request = FirewallFetchRequest(version=FirewallService.VERSION,
                                             request_id=request_id,
                                             node_id=self.agent.agent_uuid)

        fetch_response = self.get_response(self.stub.FetchLatestRules, fetch_request)
        if fetch_response:
            response_time = (time.time() - ping_time) * 1000
            self.logger.info(f"Latest Firewall Rules: {fetch_response}, response: {response_time} ms")

    def send_firewall_status(self):
        ping_time = time.time()
        request_id = str(uuid.uuid4())

        fetch_request = FirewallFetchRequest(version=FirewallService.VERSION,
                                             request_id=request_id,
                                             node_id=self.agent.agent_uuid)

        fetch_response = self.get_response(self.stub.FetchLatestRules, fetch_request)
        if fetch_response:
            response_time = (time.time() - ping_time) * 1000
            self.logger.info(f"Latest Firewall Rules: {fetch_response}, response: {response_time} ms")
