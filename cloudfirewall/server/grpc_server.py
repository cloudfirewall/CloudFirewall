import os

from dotenv import load_dotenv

from cloudfirewall.common.log_util import setup_logging
from cloudfirewall.server.server import CloudServer

# Load all environment variables from .env file
load_dotenv()

SERVER_HOST = os.environ.get('SERVER_HOST', 'localhost')
SERVER_PORT = int(os.environ.get('SERVER_PORT', '50051'))


if __name__ == '__main__':
    setup_logging()

    cloud_server = CloudServer(SERVER_HOST, SERVER_PORT)
    cloud_server.connect()
    cloud_server.load_servicers()
    cloud_server.start()
    cloud_server.wait_for_termination()
