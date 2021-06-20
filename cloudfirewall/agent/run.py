import os
import uuid

from dotenv import load_dotenv

from cloudfirewall.agent.agent import CloudAgent

# Load all environment variables from .env file
from cloudfirewall.common.log_util import setup_logging

load_dotenv()

SERVER_HOST = os.environ.get('SERVER_HOST', 'localhost')
SERVER_PORT = int(os.environ.get('SERVER_PORT', '50051'))
AGENT_UUID = os.environ.get('AGENT_UUID', str(uuid.uuid4()))

if __name__ == '__main__':
    setup_logging()

    agent = CloudAgent(AGENT_UUID, SERVER_HOST, SERVER_PORT)
    agent.connect()
    agent.load_plugins()
    agent.wait_for_termination()

