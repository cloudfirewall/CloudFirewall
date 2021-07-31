import asyncio
import logging
import os
import uuid

import grpc

from cloudfirewall.agent.service.agent_service import AgentService, AgentFirewall
from cloudfirewall.common.path_utils import resolve_path

SERVER_HOST = os.environ.get('SERVER_HOST', 'localhost')
SERVER_PORT = int(os.environ.get('SERVER_PORT', '50051'))

AGENT_KEY_PATH = os.environ.get('AGENT_KEY_PATH', 'certs/cloud-agent.key')
AGENT_CERT_PATH = os.environ.get('AGENT_CERT_PATH', 'certs/cloud-agent.pem')
CA_CERT_PATH = os.environ.get('CA_CERT_PATH', 'certs/cloud-ca.pem')


class CloudAgent:

    def __init__(self, agent_uuid, server_host, server_port):
        self.logger = logging.getLogger(CloudAgent.__name__)

        self.server_host = server_host
        self.server_port = server_port
        self.agent_uuid = agent_uuid
        self.logger.info(f"Cloud Agent UUID: {self.agent_uuid}")

        self.channel = None
        self.credentials = None
        self.services = []

    def load_credentials(self):
        agent_key_path = resolve_path(AGENT_KEY_PATH)
        agent_cert_path = resolve_path(AGENT_CERT_PATH)
        ca_cert_path = resolve_path(CA_CERT_PATH)

        with open(str(agent_key_path), "rb") as fp:
            agent_key = fp.read()
        with open(str(agent_cert_path), "rb") as fp:
            agent_cert = fp.read()
        with open(str(ca_cert_path), "rb") as fp:
            ca_cert = fp.read()

        self.credentials = grpc.ssl_channel_credentials(ca_cert, agent_key, agent_cert)

    def connect(self):
        if not self.credentials:
            self.load_credentials()

        server_address = f'{self.server_host}:{self.server_port}'
        self.logger.info("Connecting to GRPC server %s", server_address)
        self.channel = grpc.secure_channel(server_address, self.credentials)

    def disconnect(self):
        self.logger.info("Disconnecting GPRC server channel")
        self.channel.close()

    def load_services(self):
        self.logger.info("Loading GPRC services")
        agent_service = AgentService(self, self.channel)
        self.services.append(agent_service)

        agent_firewall = AgentFirewall(self, self.channel)
        self.services.append(agent_firewall)

    def wait_for_termination(self):
        loop = asyncio.get_event_loop()

        self.logger.info("Waiting for termination")
        loop.run_forever()
