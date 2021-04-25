import logging
import os
from concurrent import futures
from signal import signal, SIGTERM

import grpc

from cloudfirewall.common.path_utils import resolve_path
from cloudfirewall.server.servicer.agent_servicer import FirewallAgentServicer

SERVER_HOST = os.environ.get('SERVER_HOST', 'localhost')
SERVER_PORT = int(os.environ.get('SERVER_PORT', '50051'))

SERVER_KEY_PATH = os.environ.get('SERVER_KEY_PATH', 'certs/cloud-server.key')
SERVER_CERT_PATH = os.environ.get('SERVER_CERT_PATH', 'certs/cloud-server.pem')
CA_CERT_PATH = os.environ.get('CA_CERT_PATH', 'certs/cloud-ca.pem')

MAX_WORKERS = 10


class CloudServer:

    def __init__(self, server_host, server_port):
        self.logger = logging.getLogger(CloudServer.__name__)

        self.server_host = server_host
        self.server_port = server_port

        self.server = grpc.server(futures.ThreadPoolExecutor(max_workers=MAX_WORKERS))
        self.credentials = None
        self.servicers = []

    def load_credentials(self):
        server_key_path = resolve_path(SERVER_KEY_PATH)
        server_cert_path = resolve_path(SERVER_CERT_PATH)
        ca_cert_path = resolve_path(CA_CERT_PATH)

        with open(str(server_key_path), "rb") as fp:
            server_key = fp.read()
        with open(str(server_cert_path), "rb") as fp:
            server_cert = fp.read()
        with open(str(ca_cert_path), "rb") as fp:
            ca_cert = fp.read()

        self.credentials = grpc.ssl_server_credentials([(server_key, server_cert)],
                                                       root_certificates=ca_cert,
                                                       require_client_auth=True)

    def connect(self):
        if not self.credentials:
            self.load_credentials()

        server_address = f'{self.server_host}:{self.server_port}'
        self.logger.info("Initializing secure GRPC server %s", server_address)
        self.server.add_secure_port(f'{self.server_host}:{self.server_port}', self.credentials)

    def start(self):
        self.logger.info("Starting GPRC server")
        self.server.start()

        def handle_sigterm(*_):
            all_rpcs_done_event = self.server.stop(30)
            all_rpcs_done_event.wait(30)

        signal(SIGTERM, handle_sigterm)

    def stop(self):
        self.logger.info("Stopping GPRC server")
        self.server.stop()

    def wait_for_termination(self):
        self.logger.info("Waiting for termination")
        self.server.wait_for_termination()

    def load_servicers(self):
        self.logger.info("Loading GRPC Service servicers")
        agent_servicer = FirewallAgentServicer(self.server)
        self.servicers.append(agent_servicer)
