from cloudfirewall.agent.plugins import AgentPlugin
from cloudfirewall.agent.plugins.heartbeat.service import HeartbeatService


class HeartbeatPlugin(AgentPlugin):
    NAME = 'heartbeat'

    def __init__(self, agent, channel):
        super(HeartbeatPlugin, self).__init__()
        self.agent = agent
        self.channel = channel

    def get_name(self):
        return self.NAME

    def get_service(self):
        return HeartbeatService(self.agent, self.channel)
